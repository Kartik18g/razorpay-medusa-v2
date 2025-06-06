"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const razorpay_1 = __importDefault(require("razorpay"));
const get_smallest_unit_1 = require("../utils/get-smallest-unit");
const update_razorpay_customer_metadata_1 = require("../workflows/update-razorpay-customer-metadata");
class RazorpayBase extends utils_1.AbstractPaymentProvider {
    constructor(container, options) {
        super(container, options);
        this.options_ = options;
        this.logger = container[utils_1.ContainerRegistrationKeys.LOGGER];
        this.customerService = container[utils_1.Modules.CUSTOMER];
        this.paymentService = container[utils_1.Modules.PAYMENT];
        this.container_ = container;
        this.options_ = options;
        this.init();
    }
    init() {
        const provider = this.options_.providers?.find((p) => p.id == RazorpayBase.identifier);
        if (!provider && !this.options_.key_id) {
            throw new utils_1.MedusaError(utils_1.MedusaErrorTypes.INVALID_ARGUMENT, "razorpay not configured", utils_1.MedusaErrorCodes.CART_INCOMPATIBLE_STATE);
        }
        this.razorpay_ =
            this.razorpay_ ||
                new razorpay_1.default({
                    key_id: this.options_.key_id ?? provider?.options.key_id,
                    key_secret: this.options_.key_secret ?? provider?.options.key_secret,
                    headers: {
                        "Content-Type": "application/json",
                        "X-Razorpay-Account": this.options_.razorpay_account ??
                            provider?.options.razorpay_account ??
                            undefined
                    }
                });
    }
    static validateOptions(options) {
        if (!(0, utils_1.isDefined)(options.key_id)) {
            throw new Error("Required option `key_id` is missing in Razorpay plugin");
        }
        if (!(0, utils_1.isDefined)(options.key_secret)) {
            throw new Error("Required option `key_secret` is missing in Razorpay plugin");
        }
        if (!(0, utils_1.isDefined)(options.razorpay_account)) {
            throw new Error("Required option `razorpay_account` is missing in Razorpay plugin");
        }
        if (!(0, utils_1.isDefined)(options.automatic_expiry_period)) {
            if (!(0, utils_1.isDefined)(options.manual_expiry_period)) {
                throw new Error("Required option `manual_expiry_period` is missing in Razorpay plugin");
            }
            throw new Error("Required option `automatic_expiry_period` is missing in Razorpay plugin");
        }
        if (!(0, utils_1.isDefined)(options.webhook_secret)) {
            throw new Error("Required option `webhook_secret` is missing in Razorpay plugin");
        }
    }
    // async getEntityFromTable<T>(
    //     table_name: string,
    //     id: string[],
    //     field = "id"
    // ): Promise<T[]> {
    //     const connection = this.container[
    //         ContainerRegistrationKeys.PG_CONNECTION
    //     ] as any;
    //     const items = await connection
    //         .table(table_name)
    //         .select("*")
    //         .where(field, "in", id);
    //     return items as T[];
    // }
    // async getAllEntityFromTable<T>(table_name: string): Promise<T[]> {
    //     const connection = this.container[
    //         ContainerRegistrationKeys.PG_CONNECTION
    //     ] as any;
    //     const items = await connection.table(table_name).select("*");
    //     return items as T[];
    // }
    // private async getCartId(idempotency_key: string): Promise<string> {
    //     const ps = await this.paymentService.retrievePaymentSession(
    //         idempotency_key!
    //     );
    //     const cart_payment_collections = await this.getEntityFromTable<{
    //         cart_id: string;
    //         payment_collection_id: string;
    //         id: string;
    //     }>(
    //         "cart_payment_collection",
    //         [ps.payment_collection_id],
    //         "payment_collection_id"
    //     );
    //     const cartId = cart_payment_collections[0]?.cart_id as string;
    //     return cartId;
    // }
    async capturePayment(input) {
        const { razorpayOrder, paymentSession } = await this.getPaymentSessionAndOrderFromInput(input);
        const paymentsResponse = await this.razorpay_.orders.fetchPayments(razorpayOrder.id);
        const possibleCaptures = paymentsResponse.items?.filter((item) => item.status == "authorized");
        const result = possibleCaptures?.map(async (payment) => {
            const { id, amount, currency } = payment;
            const toPay = (0, get_smallest_unit_1.getAmountFromSmallestUnit)(Math.round(parseInt(amount.toString())), currency.toUpperCase()) * 100;
            const paymentCaptured = await this.razorpay_.payments.capture(id, toPay, currency);
            return paymentCaptured;
        });
        if (result) {
            const payments = await Promise.all(result);
            const res = payments.reduce((acc, curr) => ((acc[curr.id] = curr), acc), {});
            // (paymentSessionData as unknown as Orders.RazorpayOrder).payments =
            //     res;
            const syncResult = await this.syncPaymentSession(paymentSession.id, razorpayOrder.id);
            const returrnedResult = {
                data: {
                    razorpayOrder: syncResult.razorpayOrder
                }
            };
            return returrnedResult;
        }
        else {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `No payments found for order ${razorpayOrder.id}`);
        }
    }
    async authorizePayment(input) {
        const { razorpayOrder, paymentSession } = await this.getPaymentSessionAndOrderFromInput(input);
        const paymentStatusRequest = {
            ...input
        };
        const status = await this.getPaymentStatus(paymentStatusRequest);
        const result = await this.syncPaymentSession(paymentSession.id, razorpayOrder.id);
        if (status.status == utils_1.PaymentSessionStatus.AUTHORIZED &&
            this.options_.auto_capture) {
            status.status = utils_1.PaymentSessionStatus.CAPTURED;
        }
        return {
            data: {
                razorpayOrder: result.razorpayOrder
            },
            status: status.status
        };
    }
    async cancelPayment(input) {
        const { razorpayOrder, paymentSession } = await this.getPaymentSessionAndOrderFromInput(input);
        const fetchPayments = await this.razorpay_.orders.fetchPayments(razorpayOrder.id);
        const capturedPayments = fetchPayments.items?.filter((item) => item.status == "captured");
        if (capturedPayments.length != 0) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Cannot cancel a payment that has been captured");
        }
        const possibleRefunds = fetchPayments.items?.filter((item) => item.status == "authorized");
        const result = await Promise.all(possibleRefunds?.map(async (payment) => {
            const { id, amount, currency } = payment;
            const toPay = (0, get_smallest_unit_1.getAmountFromSmallestUnit)(Math.round(parseInt(amount.toString())), currency.toUpperCase()) * 100;
            const refund = await this.razorpay_.payments.refund(id, {
                amount: toPay,
                notes: {
                    medusa_payment_session_id: paymentSession.id
                }
            });
            return refund;
        }));
        const syncResult = await this.syncPaymentSession(paymentSession.id, razorpayOrder.id);
        return {
            data: {
                razorpayOrder: syncResult.razorpayOrder,
                razorpayRefunds: result
            }
        };
    }
    async getPaymentSessionAndOrderFromInput(input) {
        let { data, context } = input;
        if (!data?.razorpayorder) {
            if (data && data?.id) {
                data = {
                    ...data,
                    razorpayOrder: await this.razorpay_.orders.fetch(data.id)
                };
            }
        }
        let { razorpayOrder } = data;
        const paymentSessionId = razorpayOrder?.notes
            ?.medusa_payment_session_id ?? context?.idempotency_key;
        const paymentSession = await this.paymentService.retrievePaymentSession(paymentSessionId);
        if (!razorpayOrder) {
            razorpayOrder = paymentSession?.data
                ?.razorpayOrder;
        }
        if (razorpayOrder) {
            const razorpayOrder_latest = await this.razorpay_.orders.fetch(razorpayOrder.id);
            if (razorpayOrder_latest.status != razorpayOrder.status) {
                razorpayOrder = razorpayOrder_latest;
            }
        }
        // this error checking isn't necessary as the payment session and razorpay order are created in the initiatePayment method
        // if (!paymentSession) {
        //     throw new MedusaError(
        //         MedusaError.Types.NOT_FOUND,
        //         `Payment session with ID ${paymentSessionId} not found`
        //     );
        // }
        // if (!razorpayOrder) {
        //     throw new MedusaError(
        //         MedusaError.Types.NOT_FOUND,
        //         "Razorpay order with ID is not found"
        //     );
        // }
        return {
            paymentSession,
            razorpayOrder: razorpayOrder
        };
    }
    getRazorpayOrderCreateRequestBody(
    // cart: Partial<CartDTO>,
    amount, currency_code, razorpayCustomer
    //  customer: Customers.RazorpayCustomer
    ) {
        const intentRequest = {
            amount: amount,
            currency: currency_code.toUpperCase(),
            payment: {
                capture: this.options_.auto_capture ?? true ? "automatic" : "manual",
                capture_options: {
                    refund_speed: this.options_.refund_speed ?? "normal",
                    automatic_expiry_period: Math.max(this.options_.automatic_expiry_period ?? 20, 12),
                    manual_expiry_period: Math.max(this.options_.manual_expiry_period ?? 10, 7200)
                }
            }
        };
        return intentRequest;
    }
    async syncPaymentSession(paymentSessionId, razorpayOrderId) {
        const orderData = await this.updateRazorpayOrderMetadata(razorpayOrderId, {
            medusa_payment_session_id: paymentSessionId
        });
        const paymentSessionData = await this.paymentService.retrievePaymentSession(paymentSessionId);
        return {
            razorpayOrder: orderData,
            paymentSession: paymentSessionData
        };
    }
    async initiatePayment(input) {
        const paymentSessionId = input.context?.idempotency_key;
        const razorpayCustomer = input.context?.account_holder;
        const { amount, currency_code } = input;
        let toPay = (0, get_smallest_unit_1.getAmountFromSmallestUnit)(Math.round(parseInt(amount.toString())), currency_code.toUpperCase());
        toPay =
            currency_code.toUpperCase() == "INR" ? toPay * 100 * 100 : toPay;
        // if toppay has decimals, we need to remove them
        toPay = Math.round(toPay);
        try {
            const razorpayOrderCreateRequest = this.getRazorpayOrderCreateRequestBody(toPay, currency_code, razorpayCustomer);
            const razorpayOrder = await this.razorpay_.orders.create(razorpayOrderCreateRequest);
            return {
                id: paymentSessionId,
                data: { razorpayOrder: razorpayOrder }
            };
        }
        catch (error) {
            this.logger.error(`Error creating Razorpay order: ${error.message}`, error);
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Failed to create Razorpay order: ${error.message}`);
        }
    }
    async updateRazorpayOrderMetadata(orderId, metadata) {
        let orderData = await this.razorpay_.orders.fetch(orderId);
        if (!orderData) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Invoice with ID ${orderId} not found`);
        }
        let notes = orderData.notes;
        if (!notes) {
            notes = {
                ...metadata
            };
        }
        else {
            notes = {
                ...notes,
                ...metadata
            };
        }
        orderData = await this.razorpay_.orders.edit(orderId, {
            notes: {
                ...metadata
            }
        });
        return orderData;
    }
    async updateRazorpayMetadataInCustomer(customer, parameterName, parameterValue) {
        const metadata = customer.metadata;
        let razorpay = metadata?.razorpay;
        if (razorpay) {
            razorpay[parameterName] = parameterValue;
        }
        else {
            razorpay = {};
            razorpay[parameterName] = parameterValue;
        }
        //
        const x = await (0, update_razorpay_customer_metadata_1.updateRazorpayCustomerMetadataWorkflow)(this.container_).run({
            input: {
                medusa_customer_id: customer.id,
                razorpay
            }
        });
        const result = x.result.customer;
        return result;
    }
    async findOrCreateRarorpayCustomer(cart, paymentSession, customer_id) {
        let rp_customer_id;
        if (customer_id) {
            try {
                const customer = await this.customerService.retrieveCustomer(customer_id);
                rp_customer_id = customer.metadata?.razorpay?.rp_customer_id;
                if (rp_customer_id) {
                    return await this.razorpay_.customers.fetch(rp_customer_id);
                }
                else {
                    const razorpayCustomer = await this.pollAndRetrieveCustomer(customer);
                    if (razorpayCustomer) {
                        await this.updateRazorpayMetadataInCustomer(customer, "rp_customer_id", razorpayCustomer.id);
                        return razorpayCustomer;
                    }
                    else {
                        return await this.createRazorpayCustomer(cart, paymentSession, customer_id);
                    }
                }
            }
            catch (e) {
                this.logger.error(`Error retrieving customer ${customer_id}: ${e}`);
                throw new utils_1.MedusaError(utils_1.MedusaErrorTypes.NOT_FOUND, `Customer with id ${customer_id} not found`);
            }
        }
        else {
            const razorpayCustomer = await this.pollAndRetrieveCustomer({
                email: cart?.email,
                phone: cart?.billing_address?.phone
            });
            if (razorpayCustomer) {
                return razorpayCustomer;
            }
        }
        const rpCustomer = await this.createRazorpayCustomer(cart, paymentSession);
        return rpCustomer;
    }
    async createRazorpayCustomer(cart, paymentSession, customer_id) {
        const rpCustomerCreateRequest = this.getRazorpayCustomerCreateRequestBody(cart, customer_id);
        const razorpayCustomer = await this.razorpay_.customers.create(rpCustomerCreateRequest);
        if (customer_id) {
            const customer = await this.customerService.retrieveCustomer(customer_id);
            await this.updateRazorpayMetadataInCustomer(customer, "rp_customer_id", razorpayCustomer.id);
        }
        return razorpayCustomer;
    }
    async pollAndRetrieveCustomer(customer) {
        let customerList = [];
        let razorpayCustomer;
        const count = 10;
        let skip = 0;
        do {
            customerList = (await this.razorpay_.customers.all({
                count,
                skip
            }))?.items;
            razorpayCustomer =
                customerList?.find((c) => c.contact == customer?.phone ||
                    c.email == customer.email) ?? customerList?.[0];
            if (razorpayCustomer) {
                break;
            }
            if (!customerList || !razorpayCustomer) {
                throw new Error("no customers and cant create customers in razorpay");
            }
            skip += count;
        } while (customerList?.length == 0);
        return razorpayCustomer;
    }
    getRazorpayCustomerCreateRequestBody(cart, customer_id) {
        const rpCustomerCreateRequest = {
            name: `${cart?.billing_address?.first_name} ${cart?.billing_address?.last_name}`,
            email: cart?.email,
            fail_existing: 0,
            gstin: cart.billing_address?.metadata?.gstin ?? null,
            contact: cart?.billing_address?.phone ??
                cart?.shipping_address?.phone,
            notes: {
                cart_id: cart?.id,
                customer_id: customer_id ?? "NA"
            }
        };
        return rpCustomerCreateRequest;
    }
    async deletePayment(input) {
        try {
            return await this.cancelPayment(input);
        }
        catch (e) {
            this.logger.error(`Error deleting Razorpay payment: ${e.message}`, e);
            return {
                data: {
                    razorpayOrder: input.data?.razorpayOrder
                }
            };
        }
    }
    async getPaymentStatus(input) {
        const razorpayOrder = input.data
            ?.razorpayOrder;
        const id = razorpayOrder.id;
        let paymentIntent;
        let paymentsAttempted;
        try {
            paymentIntent = await this.razorpay_.orders.fetch(id);
            paymentsAttempted = await this.razorpay_.orders.fetchPayments(id);
        }
        catch (e) {
            const orderId = input.data
                .order_id;
            this.logger.warn("received payment data from session not order data");
            paymentIntent = await this.razorpay_.orders.fetch(orderId);
            paymentsAttempted = await this.razorpay_.orders.fetchPayments(orderId);
        }
        let status = utils_1.PaymentSessionStatus.PENDING;
        switch (paymentIntent.status) {
            // created' | 'authorized' | 'captured' | 'refunded' | 'failed'
            case "created":
                status = utils_1.PaymentSessionStatus.REQUIRES_MORE;
                break;
            case "paid":
                status = utils_1.PaymentSessionStatus.AUTHORIZED;
                break;
            case "attempted":
                status = await this.getRazorpayPaymentStatus(paymentIntent, paymentsAttempted);
                break;
            default:
                status = utils_1.PaymentSessionStatus.PENDING;
        }
        return { status };
    }
    async getRazorpayPaymentStatus(paymentIntent, attempts) {
        if (!paymentIntent) {
            return utils_1.PaymentSessionStatus.ERROR;
        }
        else {
            const authorisedAttempts = attempts.items.filter((i) => i.status == utils_1.PaymentSessionStatus.AUTHORIZED);
            const totalAuthorised = authorisedAttempts.reduce((p, c) => {
                p += parseInt(`${c.amount}`);
                return p;
            }, 0);
            return totalAuthorised == paymentIntent.amount
                ? utils_1.PaymentSessionStatus.AUTHORIZED
                : utils_1.PaymentSessionStatus.REQUIRES_MORE;
        }
    }
    async refundPayment(input) {
        const { razorpayOrder, paymentSession } = await this.getPaymentSessionAndOrderFromInput(input);
        const id = razorpayOrder.id;
        const refundAmount = parseFloat(input.amount.toString());
        const paymentList = await this.razorpay_.orders.fetchPayments(id);
        const payment_id = paymentList.items?.find((p) => {
            return (parseInt(`${p.amount}`) >= refundAmount * 100 &&
                (p.status == "authorized" || p.status == "captured"));
        })?.id;
        if (payment_id) {
            const refundRequest = {
                amount: refundAmount * 100
            };
            try {
                const razorpayRefundSession = await this.razorpay_.payments.refund(payment_id, refundRequest);
                const razorpayPayment = await this.razorpay_.payments.fetch(razorpayRefundSession.payment_id);
                const order = await this.razorpay_.orders.fetch(razorpayPayment.order_id);
                const result = await this.syncPaymentSession(paymentSession.id, order.id);
                const refundResult = {
                    data: {
                        razorpayOrder: result.razorpayOrder,
                        razorpayRefundSession
                    }
                };
                return refundResult;
            }
            catch (e) {
                this.logger.error(`Error creating Razorpay refund: ${e.message}`, e);
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Failed to create Razorpay refund: ${e.message}`);
            }
        }
        else {
            return {
                data: {
                    razorpayOrder: razorpayOrder
                }
            };
        }
    }
    async retrievePayment(input) {
        const { razorpayOrder, paymentSession } = await this.getPaymentSessionAndOrderFromInput(input);
        return {
            data: {
                razorpayOrder: razorpayOrder
            }
        };
    }
    async updatePayment(input) {
        const { razorpayOrder, paymentSession } = await this.getPaymentSessionAndOrderFromInput(input);
        const invoiceData = await this.updateRazorpayOrderMetadata(razorpayOrder.id, {
            ...razorpayOrder.notes,
            medusa_payment_session_id: razorpayOrder.notes
                ?.medusa_payment_session_id ??
                input?.context?.idempotency_key
        });
        return {
            data: { razorpayOrder: invoiceData }
        };
    }
    async getWebhookActionAndData(webhookData) {
        const webhookSignature = webhookData.headers["x-razorpay-signature"];
        const webhookSecret = this.options_?.webhook_secret ||
            process.env.RAZORPAY_WEBHOOK_SECRET ||
            process.env.RAZORPAY_TEST_WEBHOOK_SECRET;
        const logger = this.logger;
        const data = webhookData.data;
        logger.info(`Received Razorpay webhook body as object : ${JSON.stringify(webhookData.data)}`);
        try {
            const validationResponse = razorpay_1.default.validateWebhookSignature(webhookData.rawData.toString(), webhookSignature, webhookSecret);
            // return if validation fails
            if (!validationResponse) {
                return { action: utils_1.PaymentActions.FAILED };
            }
        }
        catch (error) {
            logger.error(`Razorpay webhook validation failed : ${error}`);
            return { action: utils_1.PaymentActions.FAILED };
        }
        const paymentData = webhookData.data
            .payload?.payment?.entity;
        const event = data.event;
        const order = await this.razorpay_.orders.fetch(paymentData.order_id);
        /** sometimes this even fires before the order is updated in the remote system */
        const outstanding = (0, get_smallest_unit_1.getAmountFromSmallestUnit)(order.amount_paid == 0 ? paymentData.amount : order.amount_paid, paymentData.currency.toUpperCase());
        switch (event) {
            // payment authorization is handled in checkout flow. webhook not needed
            case "payment.captured":
                return {
                    action: utils_1.PaymentActions.SUCCESSFUL,
                    data: {
                        session_id: paymentData.notes
                            .session_id,
                        amount: outstanding
                    }
                };
            case "payment.authorized":
                return {
                    action: utils_1.PaymentActions.AUTHORIZED,
                    data: {
                        session_id: paymentData.notes
                            .session_id,
                        amount: outstanding
                    }
                };
            case "payment.failed":
                // TODO: notify customer of failed payment
                return {
                    action: utils_1.PaymentActions.FAILED,
                    data: {
                        session_id: paymentData.notes
                            .session_id,
                        amount: outstanding
                    }
                };
                break;
            default:
                return { action: utils_1.PaymentActions.NOT_SUPPORTED };
        }
    }
    async createAccountHolder(input) {
        const { first_name, last_name, email, phone, billing_address } = input
            .context.customer;
        const accountHolder = await this.razorpay_.customers.create({
            name: `${first_name} ${last_name}`,
            email: email,
            contact: phone ?? undefined,
            gstin: billing_address?.metadata?.gstin,
            notes: {
                medusa_account_holder_id: "NA"
            }
        });
        return {
            data: accountHolder,
            id: accountHolder.id
        };
    }
    async updateAccountHolder(input) {
        const { id, name, email, phone: contact } = input.data;
        const accountHolder = await this.razorpay_.customers.edit(id, {
            name: name,
            email: email,
            contact: contact
        });
        return {
            data: accountHolder
        };
    }
    async deleteAccountHolder(input) {
        const { id } = input.data;
        const accountHolder = await this.razorpay_.customers.fetch(id);
        await this.razorpay_.customers.edit(id, {
            name: "DELETED"
        });
        return {
            data: accountHolder
        };
    }
}
exports.default = RazorpayBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF6b3JwYXktYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcGF5bWVudC1yYXpvcnBheS9zcmMvY29yZS9yYXpvcnBheS1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscURBVW1DO0FBZ0RuQyx3REFBZ0M7QUFDaEMsa0VBQXVFO0FBR3ZFLHNHQUF3RztBQUl4RyxNQUFNLFlBQWEsU0FBUSwrQkFBd0M7SUFPL0QsWUFBc0IsU0FBMEIsRUFBRSxPQUFPO1FBQ3JELEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUV4QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVTLElBQUk7UUFDVixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQzFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQ3pDLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNyQyxNQUFNLElBQUksbUJBQVcsQ0FDakIsd0JBQWdC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