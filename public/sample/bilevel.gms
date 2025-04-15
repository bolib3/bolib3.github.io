Sets
    i /1*3/
    j /1*3/;

Parameters
    alpha       / 0.1 /
    dt          / 0.01 /
    dx          / 1.0 /
    iterations  / 100 /

    target_field(i,j)
      / 1.1 0, 1.2 0, 1.3 0
        2.1 0, 2.2 1, 2.3 0
        3.1 0, 3.2 0, 3.3 0 /

    sim_field(i,j)
      / 1.1 0.2, 1.2 0.2, 1.3 0.2
        2.1 0.2, 2.2 0.2, 2.3 0.2
        3.1 0.2, 3.2 0.2, 3.3 0.2 /;

Variables
    loss            "Loss function"
    source(i,j)     "Source field (design variable)"
    obj             "Objective function";

Positive Variables source;

Equations
    calc_loss       "Loss as mean squared error"
    define_obj      "Objective function";

* Mean squared error loss
calc_loss..
    loss =e= (1 / card(i) / card(j)) * sum((i,j),
             sqr(sim_field(i,j) - target_field(i,j)));

define_obj..
    obj =e= loss;

Model bilevel_outer /all/;

Solve bilevel_outer using NLP minimizing obj;

Display source.l, loss.l;
