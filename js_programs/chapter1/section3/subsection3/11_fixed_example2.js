function abs(x) {
    return x >= 0 ? x : - x;
}
const tolerance = 0.00001;
function fixed_point(f, first_guess) {
    function close_enough(x, y) {
        return abs(x - y) < tolerance;
    }
    function try_with(guess) {
        const next = f(guess);
        return close_enough(guess, next)
               ? next
               : try_with(next);
    }
    return try_with(first_guess);
}
fixed_point(y => math_sin(y) + math_cos(y), 1);

// expected: 1.2587315962971173
