"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRazorpayCustomerMetadataWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const update_customer_1 = require("./steps/update-customer");
exports.updateRazorpayCustomerMetadataWorkflow = (0, workflows_sdk_1.createWorkflow)("update-razorpay-customer-metadata", (input) => {
    const { customer, registerResponse } = (0, update_customer_1.updateCustomerMetadataStep)(input);
    return new workflows_sdk_1.WorkflowResponse({
        customer,
        registerResponse
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheW1lbnQtcmF6b3JwYXkvc3JjL3dvcmtmbG93cy91cGRhdGUtcmF6b3JwYXktY3VzdG9tZXItbWV0YWRhdGEvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBRzJDO0FBRTNDLDZEQUFxRTtBQU14RCxRQUFBLHNDQUFzQyxHQUFHLElBQUEsOEJBQWMsRUFDaEUsbUNBQW1DLEVBQ25DLENBQUMsS0FBMEMsRUFBRSxFQUFFO0lBQzNDLE1BQU0sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsR0FDaEMsSUFBQSw0Q0FBMEIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUV0QyxPQUFPLElBQUksZ0NBQWdCLENBQUM7UUFDeEIsUUFBUTtRQUNSLGdCQUFnQjtLQUNuQixDQUFDLENBQUM7QUFDUCxDQUFDLENBQ0osQ0FBQyJ9