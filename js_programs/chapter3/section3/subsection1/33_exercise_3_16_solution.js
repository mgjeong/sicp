const cycle = make_cycle(three_list);

const three_list = list("a", "b", "c");

const one = pair("a", "b");
const three = pair(one, one);
const four = pair(three, "c");
const seven = pair(three, three);

// return 3; return 4; return 7;
display(count_pairs(three_list));
display(count_pairs(four));
display(count_pairs(seven));

// never return at all
display(count_pairs(cycle));
