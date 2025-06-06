"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_smallest_unit_1 = require("../get-smallest-unit");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("getSmallestUnit", () => {
    (0, globals_1.it)("should convert an amount to the format required by Stripe based on currency", () => {
        // 0 decimals
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(50098, "JPY")).toBe(50098);
        // 3 decimals
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(5.124, "KWD")).toBe(5130);
        // 2 decimals
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(2.675, "USD")).toBe(268);
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(100.54, "USD")).toBe(10054);
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(5.126, "KWD")).toBe(5130);
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(0.54, "USD")).toBe(54);
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(0.054, "USD")).toBe(5);
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(0.005104, "USD")).toBe(1);
        (0, globals_1.expect)((0, get_smallest_unit_1.getSmallestUnit)(0.004104, "USD")).toBe(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXNtYWxsZXN0LXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheW1lbnQtcmF6b3JwYXkvc3JjL3V0aWxzL19fdGVzdHNfXy9nZXQtc21hbGxlc3QtdW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDREQUF1RDtBQUN2RCwyQ0FBcUQ7QUFFckQsSUFBQSxrQkFBUSxFQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFBLFlBQUUsRUFBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7UUFDbkYsYUFBYTtRQUNiLElBQUEsZ0JBQU0sRUFBQyxJQUFBLG1DQUFlLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxELGFBQWE7UUFDYixJQUFBLGdCQUFNLEVBQUMsSUFBQSxtQ0FBZSxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqRCxhQUFhO1FBQ2IsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEQsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUMsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBQSxnQkFBTSxFQUFDLElBQUEsbUNBQWUsRUFBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9