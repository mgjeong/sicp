function make_interval(x, y) {
    return pair(x, y);
}
function lower_bound(x) { 
    return head(x); 
}
function upper_bound(x) { 
    return tail(x); 
}
function mul_interval(x, y) {
    const p1 = lower_bound(x) * lower_bound(y);
    const p2 = lower_bound(x) * upper_bound(y);
    const p3 = upper_bound(x) * lower_bound(y);
    const p4 = upper_bound(x) * upper_bound(y);
    return make_interval(math_min(p1, p2, p3, p4),
                         math_max(p1, p2, p3, p4));
}
// printing the interval in one line requires some string
// manipulation: stringify turns a number into a string 
// and the operator + can be applied to strings for
// string concatenation
function print_interval(i) {
    return "[ "  + stringify(lower_bound(i)) + 
           " , " + stringify(upper_bound(i)) + " ]";
}
function div_interval(x, y) {
    return lower_bound(y) <= 0 && upper_bound(y) >= 0
        ? error("division error (interval spans 0)")
        : mul_interval(x, make_interval(1 / upper_bound(y),
                                        1 / lower_bound(y)));
}

print_interval(div_interval(make_interval(1, 2), 
                            make_interval(3, 5)));

// expected: '[ 0.2 , 0.6666666666666666 ]'
