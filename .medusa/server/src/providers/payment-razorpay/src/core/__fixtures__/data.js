"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentDataWithoutAmountDataNoNotes = exports.updatePaymentDataWithoutAmountData = exports.updatePaymentDataWithAmountData = exports.updatePaymentContextFailWithDifferentAmount = exports.updatePaymentContextWithDifferentAmount = exports.updatePaymentContextWithWrongEmail = exports.updatePaymentContextWithExistingCustomerRazorpayId = exports.updatePaymentContextWithExistingCustomer = exports.retrievePaymentFailData = exports.retrievePaymentSuccessData = exports.refundPaymentFailData = exports.refundPaymentSuccessData = exports.deletePaymentPartiallyFailData = exports.deletePaymentFailData = exports.deletePaymentSuccessData = exports.capturePaymentContextPartiallyFailData = exports.capturePaymentContextFailData = exports.capturePaymentContextSuccessData = exports.cancelPaymentPartiallyFailData = exports.cancelPaymentFailData = exports.cancelPaymentSuccessData = exports.authorizePaymentSuccessData = exports.initiatePaymentContextWithFailIntentCreation = exports.initiatePaymentContextWithWrongEmail = exports.initiatePaymentContextWithExistingCustomerRazorpayId = exports.initiatePaymentContextWithExistingCustomer = exports.PaymentIntentDataByStatus = void 0;
const razorpay_1 = require("../__mocks__/razorpay");
// import { PaymentIntentDataByStatus } from "../__fixtures__/data";
exports.PaymentIntentDataByStatus = {
    ATTEMPTED: {
        id: "test-user-1234"
    },
    SUCCEEDED: {
        id: "test-user-1234"
    },
    CANCELED: {
        id: "test-user-1234"
    },
    FAILED: {
        id: "test-user-1234"
    },
    UNKNOWN: {
        id: "test-user-1234"
    },
    CREATED: {
        id: "test-user-1234"
    }
};
// INITIATE PAYMENT DATA
exports.initiatePaymentContextWithExistingCustomer = {
    email: razorpay_1.EXISTING_CUSTOMER_EMAIL,
    phone: "9876542321",
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: {
        last_name: "test",
        first_name: "customer",
        phone: "9876542321"
    },
    context: {},
    paymentSessionData: {},
    metadata: {}
};
exports.initiatePaymentContextWithExistingCustomerRazorpayId = {
    email: razorpay_1.EXISTING_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: {
        phone: "9876542321",
        last_name: "test",
        first_name: "customer",
        metadata: {
            razorpay_id: (0, razorpay_1.isMocksEnabled)() ? "test" : undefined
        }
    },
    context: {},
    paymentSessionData: {
        notes: {
            customer_id: "TEST-CUSTOMER"
        }
    }
};
exports.initiatePaymentContextWithWrongEmail = {
    email: razorpay_1.WRONG_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: { last_name: "test", first_name: "customer" },
    context: {},
    paymentSessionData: {}
};
exports.initiatePaymentContextWithFailIntentCreation = {
    email: razorpay_1.EXISTING_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: { last_name: "test", first_name: "customer" },
    context: {
        payment_description: "fail"
    },
    paymentSessionData: {}
};
// AUTHORIZE PAYMENT DATA
exports.authorizePaymentSuccessData = {
    id: exports.PaymentIntentDataByStatus.ATTEMPTED.id
};
// CANCEL PAYMENT DATA
exports.cancelPaymentSuccessData = {
    id: exports.PaymentIntentDataByStatus.ATTEMPTED.id
};
exports.cancelPaymentFailData = {
    id: razorpay_1.FAIL_INTENT_ID
};
exports.cancelPaymentPartiallyFailData = {
    id: razorpay_1.PARTIALLY_FAIL_INTENT_ID
};
// CAPTURE PAYMENT DATA
exports.capturePaymentContextSuccessData = {
    paymentSessionData: {
        id: exports.PaymentIntentDataByStatus.ATTEMPTED.id
    }
};
exports.capturePaymentContextFailData = {
    paymentSessionData: {
        id: razorpay_1.FAIL_INTENT_ID
    }
};
exports.capturePaymentContextPartiallyFailData = {
    paymentSessionData: {
        id: razorpay_1.PARTIALLY_FAIL_INTENT_ID
    }
};
// DELETE PAYMENT DATA
exports.deletePaymentSuccessData = {
    id: exports.PaymentIntentDataByStatus.ATTEMPTED.id
};
exports.deletePaymentFailData = {
    id: razorpay_1.FAIL_INTENT_ID
};
exports.deletePaymentPartiallyFailData = {
    id: razorpay_1.PARTIALLY_FAIL_INTENT_ID
};
// REFUND PAYMENT DATA
exports.refundPaymentSuccessData = {
    sessionid: exports.PaymentIntentDataByStatus.ATTEMPTED.id
};
exports.refundPaymentFailData = {
    id: razorpay_1.FAIL_INTENT_ID
};
// RETRIEVE PAYMENT DATA
exports.retrievePaymentSuccessData = {
    id: exports.PaymentIntentDataByStatus.ATTEMPTED.id
};
exports.retrievePaymentFailData = {
    id: razorpay_1.FAIL_INTENT_ID
};
// UPDATE PAYMENT DATA
exports.updatePaymentContextWithExistingCustomer = {
    email: razorpay_1.EXISTING_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: {},
    context: {},
    paymentSessionData: {
        customer: "test",
        amount: 1000
    }
};
exports.updatePaymentContextWithExistingCustomerRazorpayId = {
    email: razorpay_1.EXISTING_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: {
        metadata: {
            razorpay_id: "test"
        }
    },
    context: {},
    paymentSessionData: {
        customer: "test",
        amount: 1000
    }
};
exports.updatePaymentContextWithWrongEmail = {
    email: razorpay_1.WRONG_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 1000,
    resource_id: "test",
    customer: {},
    context: {},
    paymentSessionData: {
        customer: "test",
        amount: 1000
    }
};
exports.updatePaymentContextWithDifferentAmount = {
    customer_id: "cust_test12345",
    email: razorpay_1.WRONG_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 2000,
    resource_id: "test",
    customer: {
        metadata: {
            razorpay_id: "test"
        }
    },
    context: {},
    paymentSessionData: {
        id: exports.PaymentIntentDataByStatus.ATTEMPTED.id,
        customer: "test",
        amount: 1000
    }
};
exports.updatePaymentContextFailWithDifferentAmount = {
    email: razorpay_1.WRONG_CUSTOMER_EMAIL,
    currency_code: "inr",
    amount: 2000,
    resource_id: "test",
    customer: {
        metadata: {
            razorpay_id: "test"
        }
    },
    context: {
        metadata: {
            razorpay_id: "test"
        }
    },
    paymentSessionData: {
        id: razorpay_1.FAIL_INTENT_ID,
        customer: "test",
        amount: 1000
    }
};
exports.updatePaymentDataWithAmountData = {
    sessionId: razorpay_1.RAZORPAY_ID ?? "test",
    amount: 2000
};
exports.updatePaymentDataWithoutAmountData = {
    sessionId: razorpay_1.RAZORPAY_ID ?? "test",
    id: razorpay_1.RAZORPAY_ID ?? "test", // /duplication needs to be fixed
    /** only notes can be updated */
    notes: {
        customProp: "test",
        test: "test-string"
    }
};
exports.updatePaymentDataWithoutAmountDataNoNotes = {
    sessionId: razorpay_1.RAZORPAY_ID ?? "test",
    id: razorpay_1.RAZORPAY_ID ?? "test" // /duplication needs to be fixed
    /** only notes can be updated */
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcGF5bWVudC1yYXpvcnBheS9zcmMvY29yZS9fX2ZpeHR1cmVzX18vZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFPK0I7QUFDL0Isb0VBQW9FO0FBRXZELFFBQUEseUJBQXlCLEdBQUc7SUFDckMsU0FBUyxFQUFFO1FBQ1AsRUFBRSxFQUFFLGdCQUFnQjtLQUN2QjtJQUNELFNBQVMsRUFBRTtRQUNQLEVBQUUsRUFBRSxnQkFBZ0I7S0FDdkI7SUFDRCxRQUFRLEVBQUU7UUFDTixFQUFFLEVBQUUsZ0JBQWdCO0tBQ3ZCO0lBQ0QsTUFBTSxFQUFFO1FBQ0osRUFBRSxFQUFFLGdCQUFnQjtLQUN2QjtJQUNELE9BQU8sRUFBRTtRQUNMLEVBQUUsRUFBRSxnQkFBZ0I7S0FDdkI7SUFDRCxPQUFPLEVBQUU7UUFDTCxFQUFFLEVBQUUsZ0JBQWdCO0tBQ3ZCO0NBQ0osQ0FBQztBQUNGLHdCQUF3QjtBQUVYLFFBQUEsMENBQTBDLEdBQUc7SUFDdEQsS0FBSyxFQUFFLGtDQUF1QjtJQUM5QixLQUFLLEVBQUUsWUFBWTtJQUNuQixhQUFhLEVBQUUsS0FBSztJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFFBQVEsRUFBRTtRQUNOLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLEtBQUssRUFBRSxZQUFZO0tBQ3RCO0lBQ0QsT0FBTyxFQUFFLEVBQUU7SUFDWCxrQkFBa0IsRUFBRSxFQUFFO0lBQ3RCLFFBQVEsRUFBRSxFQUFFO0NBQ2YsQ0FBQztBQUVXLFFBQUEsb0RBQW9ELEdBQUc7SUFDaEUsS0FBSyxFQUFFLGtDQUF1QjtJQUU5QixhQUFhLEVBQUUsS0FBSztJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFFB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