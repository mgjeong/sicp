function front_ptr(queue) { return head(queue); }

function rear_ptr(queue) { return tail(queue); }

function set_front_ptr(queue, item) { set_head(queue, item); }

function set_rear_ptr(queue, item) { set_tail(queue, item); }
function is_empty_queue(queue) { return is_null(front_ptr(queue)); }
function insert_queue(queue, item) {
    const new_pair = pair(item, null);
    if (is_empty_queue(queue)) {
        set_front_ptr(queue, new_pair);
        set_rear_ptr(queue, new_pair);
    } else {
        set_tail(rear_ptr(queue), new_pair);
        set_rear_ptr(queue, new_pair);
    }
    return queue;
}
function make_queue() { return pair(null, null); }
const q1 = make_queue();
insert_queue(q1, "a");
insert_queue(q1, "b");
