function make_f(init) {
    return x => {
        init = x - init;
        return init;
    };
}

const f = make_f(1/2);

display(f(1) + f(0));
display(f(0) + f(1));
