// operation_table, put and get
// from chapter 3 (section 3.3.3)
function assoc(key, records) {
    return is_null(records)
           ? undefined
           : equal(key, head(head(records)))
             ? head(records)
             : assoc(key, tail(records));
}
function make_table() {
    const local_table = list("*table*");
    function lookup(key_1, key_2) {
        const subtable = assoc(key_1, tail(local_table));
        if (is_undefined(subtable)) {
            return undefined;
        } else {
            const record = assoc(key_2, tail(subtable));
            if (is_undefined(record)) {
                return undefined;
            } else {
                return tail(record);
            }
        }
    }
    function insert(key_1, key_2, value) {
        const subtable = assoc(key_1, tail(local_table));
        if (is_undefined(subtable)) {
            set_tail(local_table,
                     pair(list(key_1, pair(key_2, value)),
                          tail(local_table)));
        } else {
            const record = assoc(key_2, tail(subtable));
            if (is_undefined(record)) {
                set_tail(subtable,
                         pair(pair(key_2, value),
                              tail(subtable)));
            } else {
                set_tail(record, value);
            }
        }
    }
    function dispatch(m) {
        return m === "lookup"
               ? lookup
               : m === "insert"
                 ? insert
                 : "undefined operation -- table";
    }
    return dispatch;
}
const operation_table = make_table();
const get = operation_table("lookup");
const put = operation_table("insert");

// In Source, most functions have a fixed number of arguments.
// (The function list is the only exception, to this so far.)
// The function apply_in_underlying_javascript allows us to
// apply any given function fun to all elements of the argument
// list args, as if they were separate arguments
function apply(fun, args) {
    return apply_in_underlying_javascript(fun, args);
}
function add(x, y) {
    return apply_generic("add", list(x, y));
}
function sub(x, y) {
    return apply_generic("sub", list(x, y));
}
function mul(x, y) {
    return apply_generic("mul", list(x, y));
}
function div(x, y) {
    return apply_generic("div", list(x, y));
}

function attach_tag(type_tag, contents) {
    return pair(type_tag, contents);
}
function type_tag(datum) {
    return is_pair(datum)
           ? head(datum)
           : error(datum, "bad tagged datum -- type_tag");
}
function contents(datum) {
    return is_pair(datum)
           ? tail(datum)
           : error(datum, "bad tagged datum -- contents");
}
// generic selector functions for complex numbers

function real_part(z) {
    return apply_generic("real_part", list(z));
}
function imag_part(z) {
    return apply_generic("imag_part", list(z));
}
function magnitude(z) {
    return apply_generic("magnitude", list(z));
}
function angle(z) {
    return apply_generic("angle", list(z));
}
function square(x) {
    return x * x;
}

function install_rectangular_package() {
    function real_part(z) { return head(z); }
    function imag_part(z) { return tail(z); }
    function make_from_real_imag(x, y) { return pair(x, y); }
    function magnitude(z) {
        return math_sqrt(square(real_part(z)) +
                   square(imag_part(z)));
    }
    function angle(z) {
        return math_atan(imag_part(z), real_part(z));
    }
    function make_from_mag_ang(r, a) {
        return pair(r * math_cos(a), r * math_sin(a));
    }
    // interface to the rest of the system
    function tag(x) {
        return attach_tag("rectangular", x);
    }
    put("real_part", list("rectangular"), real_part);
    put("imag_part", list("rectangular"), imag_part);
    put("magnitude", list("rectangular"), magnitude);
    put("angle", list("rectangular"), angle);
    put("make_from_real_imag", "rectangular",
        (x, y) => tag(make_from_real_imag(x, y)));
    put("make_from_mag_ang", "rectangular",
        (r, a) => tag(make_from_mag_ang(r, a)));
    return "done";
}
install_rectangular_package();

function install_polar_package() {
    // internal functions
    function magnitude(z) { return head(z); }
    function angle(z) { return tail(z); }
    function make_from_mag_ang(r, a) { return pair(r, a); }
    function real_part(z) {
        return magnitude(z) * math_cos(angle(z));
    }
    function imag_part(z) {
        return magnitude(z) * math_sin(angle(z));
    }
    function make_from_real_imag(x, y) {
        return pair(math_sqrt(square(x) + square(y)),
                    math_atan(y, x));
    }

    // interface to the rest of the system
    function tag(x) { return attach_tag("polar", x); }
    put("real_part", list("polar"), real_part);
    put("imag_part", list("polar"), imag_part);
    put("magnitude", list("polar"), magnitude);
    put("angle", list("polar"), angle);
    put("make_from_real_imag", "polar",
        (x, y) => tag(make_from_real_imag(x, y)));
    put("make_from_mag_ang", "polar",
        (r, a) => tag(make_from_mag_ang(r, a)));
    return "done";
}
install_polar_package();

function install_complex_package() {
    // imported functions from rectangular and polar packages
    function make_from_real_imag(x, y) {
        return get("make_from_real_imag", "rectangular")(x, y);
    }
    function make_from_mag_ang(r, a) {
        return get("make_from_mag_ang", "polar")(r, a);
    }

    // internal functions
    function add_complex(z1, z2) {
        return make_from_real_imag(real_part(z1) +
                                   real_part(z2),
                                   imag_part(z1) +
                                   imag_part(z2));
    }
    function sub_complex(z1, z2) {
        return make_from_real_imag(real_part(z1) -
                                   real_part(z2),
                                   imag_part(z1) -
                                   imag_part(z2));
    }
    function mul_complex(z1, z2) {
        return make_from_mag_ang(magnitude(z1) *
                                 magnitude(z2),
                                 angle(z1) +
                                 angle(z2));
    }
    function div_complex(z1, z2) {
        return make_from_mag_ang(magnitude(z1) /
                                 magnitude(z2),
                                 angle(z1) -
                                 angle(z2));
    }

    // interface to rest of the system
    function tag(z) {
        return attach_tag("complex", z);
    }
    put("add", list("complex", "complex"),
        (z1, z2) => tag(add_complex(z1, z2)));
    put("sub", list("complex", "complex"),
        (z1, z2) => tag(sub_complex(z1, z2)));
    put("mul", list("complex", "complex"),
        (z1, z2) => tag(mul_complex(z1, z2)));
    put("div", list("complex", "complex"),
        (z1, z2) => tag(div_complex(z1, z2)));
    put("make_from_real_imag", "complex",
        (x, y) => tag(make_from_real_imag(x, y)));
    put("make_from_mag_ang", "complex",
        (r, a) => tag(make_from_mag_ang(r, a)));
    return "done";
}
install_complex_package();

function make_complex_from_real_imag(x, y){
    return get("make_from_real_imag", "complex")(x, y);
}
function make_complex_from_mag_ang(r, a){
    return get("make_from_mag_ang", "complex")(r, a);
}
// coercion support

let coercion_list = null;

function clear_coercion_list() {
    coercion_list = null;
}

function put_coercion(type1, type2, item) {
    if (is_undefined(get_coercion(type1, type2))) {
        coercion_list = pair(list(type1, type2, item),
                             coercion_list);
    } else {
        return coercion_list;
    }
}

function get_coercion(type1, type2) {
    function get_type1(list_item) {
        return head(list_item);
    }
    function get_type2(list_item) {
        return head(tail(list_item));
    }
    function get_item(list_item) {
        return head(tail(tail(list_item)));
    }
    function get_coercion_iter(items) {
        if (is_null(items)) {
            return undefined;
        } else {
            const top = head(items);
            return equal(type1, get_type1(top)) &&
                   equal(type2, get_type2(top))
                   ? get_item(top)
                   : get_coercion_iter(tail(items));
        }
    }
    return get_coercion_iter(coercion_list);
}
function install_javascript_number_package() {
    function tag(x) {
        return attach_tag("javascript_number", x);
    }
    put("add", list("javascript_number", "javascript_number"),
        (x, y) => tag(x + y));
    put("sub", list("javascript_number", "javascript_number"),
        (x, y) => tag(x - y));
    put("mul", list("javascript_number", "javascript_number"),
        (x, y) => tag(x * y));
    put("div", list("javascript_number", "javascript_number"),
        (x, y) => tag(x / y));
    put("exp", list("javascript_number", "javascript_number"),
    (x, y) => tag(math_exp(x, y)));
    put("make", "javascript_number",
        x => tag(x));
    return "done";
}
install_javascript_number_package();

function make_javascript_number(n) {
    return get("make", "javascript_number")(n);
}

function javascript_number_to_javascript_number(n) {
    return n;
}
function complex_to_complex(n) {
    return n;
}
put_coercion("javascript_number", "javascript_number",
             javascript_number_to_javascript_number);
put_coercion("complex", "complex",
             complex_to_complex);
function exp(x, y) {
    return apply_generic("exp", list(x, y));
}

const c = make_javascript_number(4);
const d = make_javascript_number(2);
exp(c, d);
