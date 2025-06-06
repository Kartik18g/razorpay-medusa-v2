"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_base_1 = __importDefault(require("../core/razorpay-base"));
const types_1 = require("../types");
class RazorpayProviderService extends razorpay_base_1.default {
    constructor(_, options) {
        super(_, options);
    }
    get paymentIntentOptions() {
        return {};
    }
}
RazorpayProviderService.identifier = types_1.PaymentProviderKeys.RAZORPAY;
exports.default = RazorpayProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF6b3JwYXktcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheW1lbnQtcmF6b3JwYXkvc3JjL3NlcnZpY2VzL3Jhem9ycGF5LXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMEVBQWlEO0FBQ2pELG9DQUFxRTtBQUVyRSxNQUFNLHVCQUF3QixTQUFRLHVCQUFZO0lBRzlDLFlBQVksQ0FBQyxFQUFFLE9BQU87UUFDbEIsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxvQkFBb0I7UUFDcEIsT0FBTyxFQUFTLENBQUM7SUFDckIsQ0FBQzs7QUFSTSxrQ0FBVSxHQUFHLDJCQUFtQixDQUFDLFFBQVEsQ0FBQztBQVdyRCxrQkFBZSx1QkFBdUIsQ0FBQyJ9