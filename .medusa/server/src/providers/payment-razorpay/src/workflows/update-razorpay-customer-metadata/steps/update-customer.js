"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerMetadataStep = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
exports.updateCustomerMetadataStep = (0, workflows_sdk_1.createStep)("create-customer-step", async (input, { container }) => {
    const customerService = container.resolve(utils_1.Modules.CUSTOMER);
    // 1. create customer
    const customer = await customerService.retrieveCustomer(input.medusa_customer_id);
    // 2. create auth identity
    const { medusa_customer_id, ...rest } = input;
    const { razorpay } = rest;
    const registerResponse = await customerService.updateCustomers(medusa_customer_id, {
        metadata: {
            ...customer.metadata,
            razorpay: {
                ...razorpay
            }
        }
    });
    // 4. do we want to authenticate immediately?
    //
    // const authenticationResponse = await authService.authenticate("emailpass", {
    //   body: {
    //     email: input.email,
    //     password: input.password,
    //   },
    // } as AuthenticationInput);
    return new workflows_sdk_1.StepResponse({ customer: customer, registerResponse }, customer.id);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLWN1c3RvbWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9wYXltZW50LXJhem9ycGF5L3NyYy93b3JrZmxvd3MvdXBkYXRlLXJhem9ycGF5LWN1c3RvbWVyLW1ldGFkYXRhL3N0ZXBzL3VwZGF0ZS1jdXN0b21lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBNkU7QUFFN0UscURBQW9EO0FBR3ZDLFFBQUEsMEJBQTBCLEdBQUcsSUFBQSwwQkFBVSxFQUNoRCxzQkFBc0IsRUFDdEIsS0FBSyxFQUFFLEtBQTBDLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hFLE1BQU0sZUFBZSxHQUEyQixTQUFTLENBQUMsT0FBTyxDQUM3RCxlQUFPLENBQUMsUUFBUSxDQUNuQixDQUFDO0lBRUYscUJBQXFCO0lBQ3JCLE1BQU0sUUFBUSxHQUFHLE1BQU0sZUFBZSxDQUFDLGdCQUFnQixDQUNuRCxLQUFLLENBQUMsa0JBQWtCLENBQzNCLENBQUM7SUFFRiwwQkFBMEI7SUFDMUIsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzlDLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUE4QixDQUFDO0lBQ3BELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxlQUFlLENBQUMsZUFBZSxDQUMxRCxrQkFBa0IsRUFDbEI7UUFDSSxRQUFRLEVBQUU7WUFDTixHQUFHLFFBQVEsQ0FBQyxRQUFRO1lBQ3BCLFFBQVEsRUFBRTtnQkFDTixHQUFJLFFBQThDO2FBQ3JEO1NBQ0o7S0FDSixDQUNKLENBQUM7SUFFRiw2Q0FBNkM7SUFDN0MsRUFBRTtJQUNGLCtFQUErRTtJQUMvRSxZQUFZO0lBQ1osMEJBQTBCO0lBQzFCLGdDQUFnQztJQUNoQyxPQUFPO0lBQ1AsNkJBQTZCO0lBRTdCLE9BQU8sSUFBSSw0QkFBWSxDQUNuQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsRUFDeEMsUUFBUSxDQUFDLEVBQUUsQ0FDZCxDQUFDO0FBQ04sQ0FBQyxDQUNKLENBQUMifQ==