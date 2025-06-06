"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayTest = void 0;
const razorpay_base_1 = __importDefault(require("../razorpay-base"));
class RazorpayTest extends razorpay_base_1.default {
    constructor(_, options) {
        super(_, options);
    }
    get paymentIntentOptions() {
        return {
            amount: 100,
            currency: "inr"
        };
    }
}
exports.RazorpayTest = RazorpayTest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF6b3JwYXktdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcGF5bWVudC1yYXpvcnBheS9zcmMvY29yZS9fX2ZpeHR1cmVzX18vcmF6b3JwYXktdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxRUFBNEM7QUFHNUMsTUFBYSxZQUFhLFNBQVEsdUJBQVk7SUFDMUMsWUFBWSxDQUFDLEVBQUUsT0FBd0I7UUFDbkMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxvQkFBb0I7UUFDcEIsT0FBTztZQUNILE1BQU0sRUFBRSxHQUFHO1lBQ1gsUUFBUSxFQUFFLEtBQUs7U0FDbEIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQVhELG9DQVdDIn0=