"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayMock = exports.FAIL_INTENT_ID = exports.PARTIALLY_FAIL_INTENT_ID = exports.RAZORPAY_ID = exports.EXISTING_CUSTOMER_EMAIL = exports.WRONG_CUSTOMER_EMAIL = void 0;
exports.isMocksEnabled = isMocksEnabled;
const data_1 = require("../__fixtures__/data");
const razorpay_1 = __importDefault(require("razorpay"));
const types_1 = require("../../types");
const globals_1 = require("@jest/globals");
exports.WRONG_CUSTOMER_EMAIL = "wrong@test.fr";
exports.EXISTING_CUSTOMER_EMAIL = "right@test.fr";
exports.RAZORPAY_ID = isMocksEnabled() ? "test" : process.env.RAZORPAY_ID;
exports.PARTIALLY_FAIL_INTENT_ID = "partially_unknown";
exports.FAIL_INTENT_ID = "unknown";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mockEnabled = process.env.DISABLE_MOCKS == "true" ? false : true;
function isMocksEnabled() {
    if (mockEnabled) {
        console.log("using mocks");
    }
    return mockEnabled;
}
exports.RazorpayMock = {
    orders: {
        fetch: globals_1.jest.fn().mockImplementation(async (orderId) => {
            if (orderId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            return (Object.values(data_1.PaymentIntentDataByStatus).find((value) => {
                return value.id === orderId;
            }) ?? {});
        }),
        fetchPayments: globals_1.jest.fn().mockImplementation(async (orderId) => {
            if (orderId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            return (Object.values(data_1.PaymentIntentDataByStatus).find((value) => {
                return value.id === orderId;
            }) ?? {});
        }),
        edit: globals_1.jest.fn().mockImplementation(async (orderId, updateData) => {
            if (orderId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            const data = Object.values(data_1.PaymentIntentDataByStatus).find((value) => {
                return value.id === orderId;
            }) ?? {};
            return { ...data, ...updateData };
        }),
        create: globals_1.jest.fn().mockImplementation(async (data) => {
            if (data.description === "fail") {
                throw new Error("Error");
            }
            return data;
        })
    },
    payments: {
        fetch: globals_1.jest.fn().mockImplementation(async (paymentId) => {
            if (paymentId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            return (Object.values(data_1.PaymentIntentDataByStatus).find((value) => {
                return value.id === paymentId;
            }) ?? {});
        }),
        edit: globals_1.jest
            .fn()
            .mockImplementation(async (paymentId, updateData) => {
            if (paymentId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            const data = Object.values(data_1.PaymentIntentDataByStatus).find((value) => {
                return value.id === paymentId;
            }) ?? {};
            return { ...data, ...updateData };
        }),
        create: globals_1.jest.fn().mockImplementation(async (data) => {
            if (data.description === "fail") {
                throw new Error("Error");
            }
            return data;
        }),
        cancel: globals_1.jest.fn().mockImplementation(async (paymentId) => {
            if (paymentId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            if (paymentId === exports.PARTIALLY_FAIL_INTENT_ID) {
                throw new Error(JSON.stringify({
                    code: types_1.ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE,
                    payment_intent: {
                        id: paymentId,
                        status: types_1.ErrorIntentStatus.CANCELED
                    },
                    type: "invalid_request_error"
                }));
            }
            return { id: paymentId };
        }),
        capture: globals_1.jest.fn().mockImplementation(async (paymentId) => {
            if (paymentId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            if (paymentId === exports.PARTIALLY_FAIL_INTENT_ID) {
                throw new Error(JSON.stringify({
                    code: types_1.ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE,
                    payment_intent: {
                        id: paymentId,
                        status: types_1.ErrorIntentStatus.SUCCEEDED
                    },
                    type: "invalid_request_error"
                }));
            }
            return { id: paymentId };
        }),
        refund: globals_1.jest
            .fn()
            .mockImplementation(async ({ payment_intent: paymentId }) => {
            if (paymentId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            return { id: paymentId };
        })
    },
    refunds: {
        fetch: globals_1.jest.fn().mockImplementation(async (paymentId) => {
            if (paymentId === exports.FAIL_INTENT_ID) {
                throw new Error("Error");
            }
            return (Object.values(data_1.PaymentIntentDataByStatus).find((value) => {
                return value.id === paymentId;
            }) ?? {});
        })
    },
    customers: {
        create: globals_1.jest.fn().mockImplementation(async (data) => {
            if (data.email === exports.EXISTING_CUSTOMER_EMAIL) {
                return { id: exports.RAZORPAY_ID, ...data };
            }
            throw new Error("Error");
        }),
        fetch: globals_1.jest.fn().mockImplementation(async (data) => {
            const customer = {
                id: "TEST-CUSTOMER",
                entity: "customer",
                created_at: 0,
                name: "test customer",
                email: exports.EXISTING_CUSTOMER_EMAIL,
                contact: "9876543210"
            };
            return Promise.resolve(customer);
        }),
        edit: globals_1.jest.fn().mockImplementation(async (id, data) => {
            const customer = {
                id: id,
                entity: "customer",
                created_at: 0,
                name: "test customer",
                email: exports.EXISTING_CUSTOMER_EMAIL,
                contact: "9876543210"
            };
            return Promise.resolve(customer);
        })
    }
};
const razorpay = isMocksEnabled() ? globals_1.jest.fn(() => exports.RazorpayMock) : razorpay_1.default;
exports.default = razorpay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF6b3JwYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheW1lbnQtcmF6b3JwYXkvc3JjL2NvcmUvX19tb2Nrc19fL3Jhem9ycGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQWdCQSx3Q0FLQztBQXJCRCwrQ0FBaUU7QUFDakUsd0RBQWdDO0FBQ2hDLHVDQUE0RDtBQUM1RCwyQ0FBcUM7QUFDeEIsUUFBQSxvQkFBb0IsR0FBRyxlQUFlLENBQUM7QUFDdkMsUUFBQSx1QkFBdUIsR0FBRyxlQUFlLENBQUM7QUFDMUMsUUFBQSxXQUFXLEdBQUcsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDbEUsUUFBQSx3QkFBd0IsR0FBRyxtQkFBbUIsQ0FBQztBQUMvQyxRQUFBLGNBQWMsR0FBRyxTQUFTLENBQUM7QUFFeEMsb0RBQTRCO0FBRTVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV2RSxTQUFnQixjQUFjO0lBQzFCLElBQUksV0FBVyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBRVksUUFBQSxZQUFZLEdBQUc7SUFDeEIsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDbEQsSUFBSSxPQUFPLEtBQUssc0JBQWMsRUFBRSxDQUFDO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxPQUFPLENBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQ0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNwRCxPQUFPLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FDWCxDQUFDO1FBQ04sQ0FBQyxDQUFDO1FBQ0YsYUFBYSxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDMUQsSUFBSSxPQUFPLEtBQUssc0JBQWMsRUFBRSxDQUFDO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxPQUFPLENBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQ0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNwRCxPQUFPLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FDWCxDQUFDO1FBQ04sQ0FBQyxDQUFDO1FBQ0YsSUFBSSxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQWUsRUFBRSxFQUFFO1lBQ2xFLElBQUksT0FBTyxLQUFLLHNCQUFjLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBRUQsTUFBTSxJQUFJLEdBQ04sTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQ0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNwRCxPQUFPLEtBQUssQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUViLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRSxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBQ3RDLENBQUMsQ0FBQztRQUNGLE1BQU0sRUFBRSxjQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQVMsRUFBRSxFQUFFO1lBQ3JELElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxNQUFNLEVBQUUsQ0FBQztnQkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDO0tBQ0w7SUFFRCxRQUFRLEVBQUU7UUFDTixLQUFLLEVBQUUsY0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUNwRCxJQUFJLFNBQVMsS0FBSyxzQkFBYyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUVELE9BQU8sQ0FDSCxNQUFNLENBQUMsTUFBTSxDQUFDLGdDQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3BELE9BQU8sS0FBSyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUM7WUFDbEMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUNYLENBQUM7UUFDTixDQUFDLENBQUM7UUFDRixJQUFJLEVBQUUsY0FBSTthQUNMLEVBQUUsRUFBRTthQUNKLGtCQUFrQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBZSxFQUFFLEVBQUU7WUFDckQsSUFBSSxTQUFTLEtBQUssc0JBQWMsRUFBRSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxNQUFNLElBQUksR0FDTixNQUFNLENBQUMsTUFBTSxDQUFDLGdDQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3BELE9BQU8sS0FBSyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUM7WUFDbEMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWIsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFDdEMsQ0FBQyxDQUFDO1FBQ04sTUFBTSxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBUyxFQUFFLEVBQUU7WUFDckQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sRUFBRSxDQUFDO2dCQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUM7UUFDRixNQUFNLEVBQUUsY0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUNyRCxJQUFJLFNBQVMsS0FBSyxzQkFBYyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUVELElBQUksU0FBUyxLQUFLLGdDQUF3QixFQUFFLENBQUM7Z0JBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDWCxJQUFJLEVBQUUsa0JBQVUsQ0FBQywrQkFBK0I7b0JBQ2hELGNBQWMsRUFBRTt3QkFDWixFQUFFLEVBQUUsU0FBUzt3QkFDYixNQUFNLEVBQUUseUJBQWlCLENBQUMsUUFBUTtxQkFDckM7b0JBQ0QsSUFBSSxFQUFFLHVCQUF1QjtpQkFDaEMsQ0FBQyxDQUNMLENBQUM7WUFDTixDQUFDO1lBRUQsT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUM7UUFDRixPQUFPLEVBQUUsY0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUN0RCxJQUFJLFNBQVMsS0FBSyxzQkFBYyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUVELElBQUksU0FBUyxLQUFLLGdDQUF3QixFQUFFLENBQUM7Z0JBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDWCxJQUFJLEVBQUUsa0JBQVUsQ0FBQywrQkFBK0I7b0JBQ2hELGNBQWMsRUFBRTt3QkFDWixFQUFFLEVBQUUsU0FBUzt3QkFDYixNQUFNLEVBQUUseUJBQWlCLENBQUMsU0FBUztxQkFDL0I7b0JBQ1IsSUFBSSxFQUFFLHVCQUF1QjtpQkFDaEMsQ0FBQyxDQUNMLENBQUM7WUFDTixDQUFDO1lBRUQsT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUM7UUFDRixNQUFNLEVBQUUsY0FBSTthQUNQLEVBQUUsRUFBRTthQUNKLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQU8sRUFBRSxFQUFFO1lBQzdELElBQUksU0FBUyxLQUFLLHNCQUFjLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBRUQsT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUM7S0FDVDtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUssRUFBRSxjQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQ3BELElBQUksU0FBUyxLQUFLLHNCQUFjLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBRUQsT0FBTyxDQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0NBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDcEQsT0FBTyxLQUFLLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQztZQUNsQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQ1gsQ0FBQztRQUNOLENBQUMsQ0FBQztLQUNMO0lBQ0QsU0FBUyxFQUFFO1FBQ1AsTUFBTSxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBUyxFQUFFLEVBQUU7WUFDckQsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLCtCQUF1QixFQUFFLENBQUM7Z0JBQ3pDLE9BQU8sRUFBRSxFQUFFLEVBQUUsbUJBQVcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO1lBQ3hDLENBQUM7WUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQztRQUNGLEtBQUssRUFBRSxjQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQVMsRUFBRSxFQUFFO1lBQ3BELE1BQU0sUUFBUSxHQUErQjtnQkFDekMsRUFBRSxFQUFFLGVBQWU7Z0JBQ25CLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixVQUFVLEVBQUUsQ0FBQztnQkFDYixJQUFJLEVBQUUsZUFBZTtnQkFDckIsS0FBSyxFQUFFLCtCQUF1QjtnQkFDOUIsT0FBTyxFQUFFLFlBQVk7YUFDeEIsQ0FBQztZQUNGLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUFDRixJQUFJLEVBQUUsY0FBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbEQsTUFBTSxRQUFRLEdBQStCO2dCQUN6QyxFQUFFLEVBQUUsRUFBWTtnQkFDaEIsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLFVBQVUsRUFBRSxDQUFDO2dCQUNiLElBQUksRUFBRSxlQUFlO2dCQUNyQixLQUFLLEVBQUUsK0JBQXVCO2dCQUM5QixPQUFPLEVBQUUsWUFBWTthQUN4QixDQUFDO1lBQ0YsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQztLQUNMO0NBQ0osQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQVEsQ0FBQztBQUUzRSxrQkFBZSxRQUFRLENBQUMifQ==