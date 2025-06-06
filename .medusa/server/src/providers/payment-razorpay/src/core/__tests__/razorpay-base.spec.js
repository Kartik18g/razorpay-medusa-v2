"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_test_1 = require("../__fixtures__/razorpay-test");
const data_1 = require("../__fixtures__/data");
const globals_1 = require("@jest/globals");
const dotenv_1 = __importDefault(require("dotenv"));
const data_2 = require("../__fixtures__/data");
const razorpay_1 = require("../__mocks__/razorpay");
const types_1 = require("../../types");
const utils_1 = require("@medusajs/framework/utils");
let config = {
    key_id: "test",
    key_secret: "test",
    razorpay_account: "test",
    automatic_expiry_period: 30,
    manual_expiry_period: 20,
    refund_speed: "normal",
    webhook_secret: "test",
    auto_capture: false
};
if (!(0, razorpay_1.isMocksEnabled)()) {
    dotenv_1.default.config();
}
const container = {
    logger: {
        error: console.error,
        info: console.info,
        warn: console.warn,
        debug: console.log
    },
    cartService: {
        retrieve(id) {
            return { id: "test-cart", billing_address: { phone: "12345" } };
        }
    },
    customerService: {
        retrieve: (id) => {
            return { billing_address: { phone: "12345" } };
        },
        update: (id, data) => {
            const customer = {
                id,
                ...data
            };
            return customer;
        }
    }
};
config = {
    ...config,
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
    razorpay_account: process.env.RAZORPAY_ACCOUNT
};
let testPaymentSession;
let razorpayTest;
(0, globals_1.describe)("RazorpayTest", () => {
    (0, globals_1.describe)("getPaymentStatus", function () {
        (0, globals_1.beforeAll)(async () => {
            if (!(0, razorpay_1.isMocksEnabled)()) {
                globals_1.jest.requireActual("razorpay");
            }
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        if ((0, razorpay_1.isMocksEnabled)()) {
            (0, globals_1.it)("should return the correct status", async () => {
                let status;
                status = await razorpayTest.getPaymentStatus({
                    data: { id: data_1.PaymentIntentDataByStatus.CREATED.id }
                });
                (0, globals_1.expect)(status.status).toBe(utils_1.PaymentSessionStatus.PENDING);
                status = await razorpayTest.getPaymentStatus({
                    data: { id: data_1.PaymentIntentDataByStatus.CREATED.id }
                });
                (0, globals_1.expect)(status.status).toBe(utils_1.PaymentSessionStatus.PENDING);
                (0, globals_1.expect)(status.status).toBe(utils_1.PaymentSessionStatus.PENDING);
                status = await razorpayTest.getPaymentStatus({
                    data: { id: data_1.PaymentIntentDataByStatus.ATTEMPTED.id }
                });
                (0, globals_1.expect)(status.status).toBe(utils_1.PaymentSessionStatus.AUTHORIZED);
                status = await razorpayTest.getPaymentStatus({
                    data: { id: "unknown-id" }
                });
                (0, globals_1.expect)(status).toBe(utils_1.PaymentSessionStatus.PENDING);
            });
        }
        else {
            (0, globals_1.it)("should return the correct status", async () => {
                const result = await razorpayTest.initiatePayment(data_2.initiatePaymentContextWithExistingCustomer);
                const status = await razorpayTest.getPaymentStatus(result);
                (0, globals_1.expect)(status.status).toBe(utils_1.PaymentSessionStatus.REQUIRES_MORE);
            });
        }
    });
    (0, globals_1.describe)("initiatePayment", function () {
        let razorpayTest;
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should succeed with an existing customer but no razorpay id", async () => {
            const result = await razorpayTest.initiatePayment(data_2.initiatePaymentContextWithExistingCustomer);
            if ((0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.expect)(razorpay_1.RazorpayMock.orders.create).toHaveBeenCalled();
                /* expect(RazorpayMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithExistingCustomer.email,
        name: "test, customer",
      });*/
                (0, globals_1.expect)(razorpay_1.RazorpayMock.orders.create).toHaveBeenCalled();
                /* expect(RazorpayMock.orders.create).toHaveBeenCalledWith(
          expect.objectContaining({
            description: undefined,
            amount: initiatePaymentContextWithExistingCustomer.amount,
            currency: initiatePaymentContextWithExistingCustomer.currency_code,
            notes: {
              resource_id:
                initiatePaymentContextWithExistingCustomer.resource_id,
            },
            capture_method: "manual",
          })
        );*/
            }
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                session_data: globals_1.expect.any(Object),
                update_requests: {
                    customer_metadata: {
                        razorpay_id: (0, razorpay_1.isMocksEnabled)()
                            ? razorpay_1.RAZORPAY_ID
                            : globals_1.expect.stringContaining("cus")
                    }
                }
            }));
        });
        (0, globals_1.it)("should succeed with an existing customer with an existing razorpay id", async () => {
            const result = await razorpayTest.initiatePayment(data_2.initiatePaymentContextWithExistingCustomerRazorpayId);
            if ((0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.expect)(razorpay_1.RazorpayMock.customers.create).not.toHaveBeenCalled();
                (0, globals_1.expect)(razorpay_1.RazorpayMock.orders.create).toHaveBeenCalled();
                /* expect(RazorpayMock.orders.create).toMatchObject({
          description: undefined,
          amount: initiatePaymentContextWithExistingCustomer.amount,
          currency: initiatePaymentContextWithExistingCustomer.currency_code,
          notes: {
            resource_id: initiatePaymentContextWithExistingCustomer.resource_id,
          },
          capture_method: "manual",
        });*/
            }
            (0, globals_1.expect)(result).toMatchObject(!(0, razorpay_1.isMocksEnabled)()
                ? {
                    session_data: globals_1.expect.any(Object),
                    update_requests: globals_1.expect.any(Object)
                }
                : {
                    session_data: globals_1.expect.any(Object)
                });
            if (!(0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.expect)(result.session_data.id).toBeDefined();
            }
        });
        /* it("should fail on customer creation", async () => {
      /const result = await razorpayTest.initiatePayment(
        initiatePaymentContextWithWrongEmail as any
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.customers.create).toHaveBeenCalled();
        expect(RazorpayMock.customers.create).toHaveBeenCalledWith({
          email: initiatePaymentContextWithWrongEmail.email,
        });

        expect(RazorpayMock.orders.create).not.toHaveBeenCalled();
      }
      expect(result).toEqual({
        error:
          "An error occurred in initiatePayment when creating a Razorpay customer",
        code: "",
        detail: "Error",
      });
    });*/
        /* it("should fail on payment intents creation", async () => {
      const result = await razorpayTest.initiatePayment(
        initiatePaymentContextWithFailIntentCreation as any
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.customers.create).toHaveBeenCalled();
        expect(RazorpayMock.customers.create).toHaveBeenCalledWith({
          email: initiatePaymentContextWithFailIntentCreation.email,
        });

        expect(RazorpayMock.orders.create).toHaveBeenCalled();
        expect(RazorpayMock.orders.create).toHaveBeenCalledWith(
          expect.objectContaining({
            description:
              initiatePaymentContextWithFailIntentCreation.context
                .payment_description,
            amount: initiatePaymentContextWithFailIntentCreation.amount,
            currency:
              initiatePaymentContextWithFailIntentCreation.currency_code,
            notes: {
              resource_id:
                initiatePaymentContextWithFailIntentCreation.resource_id,
            },
            capture_method: "manual",
          })
        );
      }

      expect(result).toEqual({
        error:
          "An error occurred in InitiatePayment during the creation of the razorpay payment intent",
        code: "",
        detail: "Error",
      });
    });*/
    });
    (0, globals_1.describe)("authorizePayment", function () {
        let razorpayTest;
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should succeed", async () => {
            if (!(0, razorpay_1.isMocksEnabled)()) {
                testPaymentSession = await razorpayTest.initiatePayment(data_2.initiatePaymentContextWithExistingCustomer);
            }
            const result = await razorpayTest.authorizePayment((0, razorpay_1.isMocksEnabled)()
                ? data_2.authorizePaymentSuccessData
                : testPaymentSession.session_data);
            (0, globals_1.expect)(result).toMatchObject({
                data: (0, razorpay_1.isMocksEnabled)()
                    ? data_2.authorizePaymentSuccessData
                    : {
                        id: globals_1.expect.stringContaining("order_")
                    },
                status: (0, razorpay_1.isMocksEnabled)()
                    ? utils_1.PaymentSessionStatus.AUTHORIZED
                    : utils_1.PaymentSessionStatus.REQUIRES_MORE
            });
        });
    });
    (0, globals_1.describe)("cancelPayment", function () {
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should succeed", async () => {
            const result = await razorpayTest.cancelPayment({
                data: data_2.cancelPaymentSuccessData
            });
            (0, globals_1.expect)(result).toEqual({
                code: types_1.ErrorCodes.UNSUPPORTED_OPERATION,
                error: "Unable to cancel as razorpay doesn't support cancellation"
            });
        });
        (0, globals_1.it)("should fail on intent cancellation but still return the intent", async () => {
            const result = await razorpayTest.cancelPayment({
                data: data_2.cancelPaymentPartiallyFailData
            });
            (0, globals_1.expect)(result).toEqual({
                code: types_1.ErrorCodes.UNSUPPORTED_OPERATION,
                error: "Unable to cancel as razorpay doesn't support cancellation"
            });
        });
        (0, globals_1.it)("should fail on intent cancellation", async () => {
            const result = await razorpayTest.cancelPayment({
                data: data_2.cancelPaymentFailData
            });
            /* expect(result).toEqual({
        error: "An error occurred in cancelPayment",
        code: "",
        detail: "Error",
      });*/
            (0, globals_1.expect)(result).toEqual({
                code: types_1.ErrorCodes.UNSUPPORTED_OPERATION,
                error: "Unable to cancel as razorpay doesn't support cancellation"
            });
        });
    });
    (0, globals_1.describe)("capturePayment", function () {
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should succeed", async () => {
            const result = await razorpayTest.capturePayment((0, razorpay_1.isMocksEnabled)()
                ? data_2.capturePaymentContextSuccessData.paymentSessionData
                : testPaymentSession.session_data);
            if ((0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.expect)(result).toEqual({
                    id: data_1.PaymentIntentDataByStatus.ATTEMPTED.id
                });
            }
            else {
                (0, globals_1.expect)(result).toMatchObject({
                    payments: globals_1.expect.any(Object)
                });
            }
        });
        /* it("should fail on intent capture but still return the intent", async () => {
      const result = await razorpayTest.capturePayment(
        capturePaymentContextPartiallyFailData.paymentSessionData
      );

      expect(result).toEqual({
        id: PARTIALLY_FAIL_INTENT_ID,
        status: ErrorIntentStatus.SUCCEEDED,
      });
    });

    it("should fail on intent capture", async () => {
      const result = await razorpayTest.capturePayment(
        capturePaymentContextFailData.paymentSessionData
      );

      expect(result).toEqual({
        error: "An error occurred in capturePayment",
        code: "",
        detail: "Error",
      });
    });*/
    });
    (0, globals_1.describe)("deletePayment", function () {
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should succeed", async () => {
            const result = await razorpayTest.cancelPayment({
                data: data_2.deletePaymentSuccessData
            });
            (0, globals_1.expect)(result).toEqual({
                code: "payment_intent_operation_unsupported",
                error: "Unable to cancel as razorpay doesn't support cancellation"
            });
        });
        (0, globals_1.it)("should fail on intent cancellation but still return the intent", async () => {
            const result = await razorpayTest.cancelPayment({
                data: data_2.deletePaymentPartiallyFailData
            });
            (0, globals_1.expect)(result).toEqual({
                code: "payment_intent_operation_unsupported",
                error: "Unable to cancel as razorpay doesn't support cancellation"
            });
        });
        (0, globals_1.it)("should fail on intent cancellation", async () => {
            const result = await razorpayTest.cancelPayment({
                data: data_2.deletePaymentFailData
            });
            (0, globals_1.expect)(result).toEqual({
                code: "payment_intent_operation_unsupported",
                error: "Unable to cancel as razorpay doesn't support cancellation"
            });
        });
    });
    (0, globals_1.describe)("refundPayment", function () {
        const refundAmount = 500;
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should succeed", async () => {
            const result = await razorpayTest.refundPayment((0, razorpay_1.isMocksEnabled)()
                ? data_2.refundPaymentSuccessData
                : testPaymentSession.session_data);
            if ((0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.expect)(result).toMatchObject({
                    sessionid: data_1.PaymentIntentDataByStatus.ATTEMPTED.id
                });
            }
            else {
                (0, globals_1.expect)(result).toMatchObject({
                    payments: globals_1.expect.any(Object)
                });
            }
        });
        /* it("should fail on refund creation", async () => {
      const result = await razorpayTest.refundPayment(
        isMocksEnabled() ? refundPaymentFailData : testPaymentSession,
        refundAmount
      );

      expect(result).toEqual({
        error: "An error occurred in refundPayment",
        code: "",
        detail: "Error",
      });
    }); */
    });
    (0, globals_1.describe)("retrievePayment", function () {
        (0, globals_1.beforeAll)(async () => {
            const scopedContainer = { ...container };
            razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
        });
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)("should retrieve", async () => {
            const result = await razorpayTest.retrievePayment((0, razorpay_1.isMocksEnabled)()
                ? data_2.retrievePaymentSuccessData
                : testPaymentSession.session_data);
            if ((0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.expect)(result).toMatchObject({
                    status: "attempted"
                });
            }
            else {
                (0, globals_1.expect)(result.id).toBeDefined();
                (0, globals_1.expect)(result.id).toMatch("order_");
            }
        });
        /* it("should fail on refund creation", async () => {
      const result = await razorpayTest.retrievePayment(
        retrievePaymentFailData
      );

      expect(result).toEqual({
        error: "An error occurred in retrievePayment",
        code: "",
        detail: "Error",
      });
    });*/
    });
    if (!(0, razorpay_1.isMocksEnabled)()) {
        (0, globals_1.describe)("updatePayment", function () {
            if (!(0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.beforeAll)(async () => {
                    const scopedContainer = { ...container };
                    razorpayTest = new razorpay_test_1.RazorpayTest(scopedContainer, config);
                });
                (0, globals_1.beforeEach)(() => {
                    globals_1.jest.clearAllMocks();
                });
            }
            /* it("should succeed to initiate a payment with an existing customer but no razorpay id", async () => {
      const paymentContext: PaymentProcessorContext = {
        email: updatePaymentContextWithDifferentAmount.email,
        currency_code: updatePaymentContextWithDifferentAmount.currency_code,
        amount: updatePaymentContextWithDifferentAmount.amount,
        resource_id: updatePaymentContextWithDifferentAmount.resource_id,
        context: updatePaymentContextWithDifferentAmount.context,
        paymentSessionData: testPaymentSession.session_data,
      };
      const result = await razorpayTest.updatePayment(
        updatePaymentContextWithExistingCustomer as any
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.customers.create).toHaveBeenCalled();
        expect(RazorpayMock.customers.create).toHaveBeenCalledWith({
          email: updatePaymentContextWithExistingCustomer.email,
        });

        expect(RazorpayMock.orders.create).toHaveBeenCalled();
        expect(RazorpayMock.orders.create).toHaveBeenCalledWith(
          expect.objectContaining({
            description: undefined,
            amount: updatePaymentContextWithExistingCustomer.amount,
            currency: updatePaymentContextWithExistingCustomer.currency_code,
            notes: {
              resource_id: updatePaymentContextWithExistingCustomer.resource_id,
            },
            capture_method: "manual",
          })
        );
      }

      expect(result).toMatchObject({
        session_data: { id: expect.stringMatching("order") },
        update_requests: {
          customer_metadata: {
            razorpay_id: isMocksEnabled()
              ? RAZORPAY_ID
              : expect.stringMatching("cus"),
          },
        },
      });
    }, 60e6); */
            /* it("should fail to initiate a payment with an existing customer but no razorpay id", async () => {
      const result = await razorpayTest.updatePayment(
        updatePaymentContextWithWrongEmail
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.customers.create).toHaveBeenCalled();
        expect(RazorpayMock.customers.create).toHaveBeenCalledWith({
          email: updatePaymentContextWithWrongEmail.email,
        });

        expect(RazorpayMock.orders.create).not.toHaveBeenCalled();
      }
      expect(result).toEqual({
        error:
          "An error occurred in updatePayment during the initiate of the new payment for the new customer",
        code: "",
        detail:
          "An error occurred in initiatePayment when creating a Razorpay customer" +
          EOL +
          "Error",
      });
    });

    it("should succeed but no update occurs when the amount did not changed", async () => {
      const result = await razorpayTest.updatePayment(
        updatePaymentContextWithExistingCustomerRazorpayId
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.orders.edit).not.toHaveBeenCalled();
      }
      expect(result).not.toBeDefined();
    });
    */
            if (!(0, razorpay_1.isMocksEnabled)()) {
                (0, globals_1.it)("should succeed to update the intent with the new amount", async () => {
                    const paymentContext = {
                        currency_code: data_2.updatePaymentContextWithDifferentAmount.currency_code,
                        amount: data_2.updatePaymentContextWithDifferentAmount.amount,
                        context: {
                            customer: {
                                email: data_2.updatePaymentContextWithDifferentAmount.email,
                                id: data_2.updatePaymentContextWithDifferentAmount.customer_id
                            }
                            // extra: {
                            //     resource_id:
                            //         updatePaymentContextWithDifferentAmount.resource_id,
                            //     context:
                            //         updatePaymentContextWithDifferentAmount.context,
                            //     paymentSessionData: isMocksEnabled()
                            //         ? updatePaymentContextWithDifferentAmount.paymentSessionData
                            //         : testPaymentSession.session_data
                            // }
                        }
                    };
                    const result = await razorpayTest.updatePayment((0, razorpay_1.isMocksEnabled)()
                        ? data_2.updatePaymentContextWithDifferentAmount
                        : paymentContext);
                    if ((0, razorpay_1.isMocksEnabled)()) {
                        (0, globals_1.expect)(1).toBe(1);
                        console.log("test not valid in mocked mode");
                        // expect(RazorpayMock.orders.edit).toHaveBeenCalled();
                        /* expect(RazorpayMock.orders.edit).toHaveBeenCalledWith(
          updatePaymentContextWithDifferentAmount.paymentSessionData.id,
          {
            amount: updatePaymentContextWithDifferentAmount.amount,
          }
        );*/
                    }
                    (0, globals_1.expect)(result).toMatchObject({
                        session_data: {
                            amount: data_2.updatePaymentContextWithDifferentAmount.amount
                        }
                    });
                }, 60e6);
            }
            /* it("should fail to update the intent with the new amount", async () => {
      const result = await razorpayTest.updatePayment(
        updatePaymentContextFailWithDifferentAmount
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.orders.edit).toHaveBeenCalled();
        expect(RazorpayMock.orders.edit).toHaveBeenCalledWith(
          updatePaymentContextFailWithDifferentAmount.paymentSessionData.id,
          {
            amount: updatePaymentContextFailWithDifferentAmount.amount,
          }
        );
      }
      expect(result).toEqual({
        error: "An error occurred in updatePayment",
        code: "",
        detail: "Error",
      });
    });*/
        });
    }
    // describe("updatePaymentData", function () {
    //     beforeAll(async () => {
    //         const scopedContainer = { ...container };
    //         razorpayTest = new RazorpayTest(scopedContainer, config);
    //     });
    //     beforeEach(() => {
    //         jest.clearAllMocks();
    //     });
    //     it("should fail to update the payment data", async () => {
    //         const data = isMocksEnabled()
    //             ? { data: updatePaymentDataWithoutAmountDataNoNotes }
    //             : { ...updatePaymentDataWithoutAmountDataNoNotes };
    //         await razorpayTest.updatePaymentData(
    //             isMocksEnabled()
    //                 ? updatePaymentDataWithoutAmountData.sessionId
    //                 : (testPaymentSession.id as any),
    //             {
    //                 ...data,
    //                 sessionId: isMocksEnabled()
    //                     ? undefined
    //                     : testPaymentSession.id
    //             }
    //         );
    //         if (isMocksEnabled()) {
    //             expect(RazorpayMock.orders.edit).toHaveBeenCalledTimes(0);
    //         }
    //     }, 60e6);
    //     it("should succeed to update the payment data", async () => {
    //         const data = isMocksEnabled()
    //             ? {
    //                   data: {
    //                       ...updatePaymentDataWithoutAmountData,
    //                       notes: { updated: true }
    //                   }
    //               }
    //             : { ...updatePaymentDataWithoutAmountData };
    //         await razorpayTest.updatePaymentData(
    //             isMocksEnabled()
    //                 ? updatePaymentDataWithoutAmountData.sessionId
    //                 : (testPaymentSession.id as any),
    //             {
    //                 ...data,
    //                 sessionId: isMocksEnabled()
    //                     ? undefined
    //                     : testPaymentSession.id
    //             }
    //         );
    //         if (isMocksEnabled()) {
    //             expect(RazorpayMock.orders.edit).toHaveBeenCalled();
    //         }
    //     }, 60e6);
    /* it("should fail to update the payment data if the amount is present", async () => {
      const result = await razorpayTest.updatePaymentData(
        updatePaymentDataWithAmountData.sessionId,
        { ...updatePaymentDataWithAmountData, sessionId: undefined }
      );
      if (isMocksEnabled()) {
        expect(RazorpayMock.orders.edit).not.toHaveBeenCalled();
      }
      expect(result).toEqual({
        error: "An error occurred in updatePaymentData",
        code: undefined,
        detail: "Cannot update amount, use updatePayment instead",
      });
    });*/
    //    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF6b3JwYXktYmFzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9wYXltZW50LXJhem9ycGF5L3NyYy9jb3JlL19fdGVzdHNfXy9yYXpvcnBheS1iYXNlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpRUFBNkQ7QUFDN0QsK0NBQWlFO0FBRWpFLDJDQU91QjtBQUN2QixvREFBNEI7QUFDNUIsK0NBYzhCO0FBQzlCLG9EQUkrQjtBQUMvQix1Q0FBMEQ7QUFDMUQscURBQWlFO0FBTWpFLElBQUksTUFBTSxHQUFvQjtJQUMxQixNQUFNLEVBQUUsTUFBTTtJQUNkLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLGdCQUFnQixFQUFFLE1BQU07SUFDeEIsdUJBQXVCLEVBQUUsRUFBRTtJQUMzQixvQkFBb0IsRUFBRSxFQUFFO0lBQ3hCLFlBQVksRUFBRSxRQUFRO0lBQ3RCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLFlBQVksRUFBRSxLQUFLO0NBQ3RCLENBQUM7QUFDRixJQUFJLENBQUMsSUFBQSx5QkFBYyxHQUFFLEVBQUUsQ0FBQztJQUNwQixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLENBQUM7QUFDRCxNQUFNLFNBQVMsR0FBRztJQUNkLE1BQU0sRUFBRTtRQUNKLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztRQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7UUFDbEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1FBQ2xCLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRztLQUNyQjtJQUNELFdBQVcsRUFBRTtRQUNULFFBQVEsQ0FBQyxFQUFVO1lBQ2YsT0FBTyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7UUFDcEUsQ0FBQztLQUNKO0lBQ0QsZUFBZSxFQUFF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