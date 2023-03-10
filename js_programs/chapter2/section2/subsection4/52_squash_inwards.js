function make_vect(x, y) {
    return pair(x, y);
}
function xcor_vect(vector) {
    return head(vector);
}
function ycor_vect(vector) {
    return tail(vector);
}
function scale_vect(factor, vector) {
    return make_vect(factor * xcor_vect(vector), 
                     factor * ycor_vect(vector));
}
function add_vect(vector1, vector2) {
    return make_vect(xcor_vect(vector1)  
                     + xcor_vect(vector2), 
                     ycor_vect(vector1)  
                     + ycor_vect(vector2));
}
function sub_vect(vector1, vector2) {
    return make_vect(xcor_vect(vector1)  
                     - xcor_vect(vector2), 
                     ycor_vect(vector1)  
                     - ycor_vect(vector2));
}
function make_frame(origin, edge1, edge2) {
    return list(origin, edge1, edge2);
}
function origin_frame(frame) {
    return list_ref(frame, 0);
}
function edge1_frame(frame) {
    return list_ref(frame, 1);
}
function edge2_frame(frame) {
    return list_ref(frame, 2);
}
function frame_coord_map(frame) {
    return v => add_vect(origin_frame(frame), 
                         add_vect(scale_vect(xcor_vect(v), 
                                             edge1_frame(frame)), 
                                  scale_vect(ycor_vect(v), 
                                             edge2_frame(frame))));
}
function transform_painter(painter, origin, corner1, corner2) {
    return frame => {
             const m = frame_coord_map(frame);
             const new_origin = m(origin);
             return painter(make_frame(
                                new_origin,
                                sub_vect(m(corner1), new_origin),
                                sub_vect(m(corner2), new_origin)));
           };
}
function make_segment(v_start, v_end) {
    return pair(v_start, v_end);
}
function start_segment(v) {
    return head(v);
}
function end_segment(v) {
    return tail(v);
}
// "drawing a line" here simulated
// by printing the coordinates of
// the start and end of the line
function draw_line(v_start, v_end) {
    display("line starting at");
    display(v_start);
    display("line ending at");
    display(v_end);
}
function segments_to_painter(segment_list) {
    return frame => 
             for_each(segment =>
                        draw_line(
                            frame_coord_map(frame)
                                (start_segment(segment)), 
                            frame_coord_map(frame)
                                (end_segment(segment))), 
                      segment_list);
}
const outline_start_1 = make_vect(0, 0);
const outline_end_1 = make_vect(1, 0);
const outline_segment_1 = make_segment(outline_start_1, 
                                       outline_end_1);
const outline_start_2 = make_vect(1, 0);
const outline_end_2 = make_vect(1, 1);
const outline_segment_2 = make_segment(outline_start_2, 
                                       outline_end_2);
const outline_start_3 = make_vect(1, 1);
const outline_end_3 = make_vect(0, 1);
const outline_segment_3 = make_segment(outline_start_3, 
                                       outline_end_3);
const outline_start_4 = make_vect(0, 1);
const outline_end_4 = make_vect(0, 0);
const outline_segment_4 = make_segment(outline_start_4, 
                                       outline_end_4);
const outline_painter = segments_to_painter(
                              list(outline_segment_1, 
                                   outline_segment_2,
                                   outline_segment_3,
                                   outline_segment_4));
const unit_origin = make_vect(0, 0);
const unit_edge_1 = make_vect(1, 0);
const unit_edge_2 = make_vect(0, 1);
const unit_frame = make_frame(unit_origin, 
                              unit_edge_1,
                              unit_edge_2);
function squash_inwards(painter) {
    return transform_painter(painter,
                             make_vect(0, 0),
                             make_vect(0.65, 0.35),
                             make_vect(0.35, 0.65));
}

const squashed_outline_painter =
          squash_inwards(outline_painter);

squashed_outline_painter(unit_frame);
