function member(item, x) {
    return is_null(x)
           ? null
           : item === head(x)
           ? x
           : member(item, tail(x));
}
member("apple", list("x", "y", "apple", "pear"));

// expected: [ 'apple', [ 'pear', null ] ]
