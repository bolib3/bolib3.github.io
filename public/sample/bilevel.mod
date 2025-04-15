# ==== Bilevel Optimization Stub in AMPL ====

# Indexing (e.g. 3x3 grid)
set INDEX := 1 2 3;

# Simulation parameters
param alpha := 0.1;
param dt := 0.01;
param dx := 1.0;
param iterations := 100;

# Target field (desired final state of diffusion)
param target_field : 
1   2   3 :=
1   0   0   0
2   0   1   0
3   0   0   0;

# Design variable: source term to be optimized
var source {i in INDEX, j in INDEX} >= 0;

# === Black-box simulated result ===
# In practice, this would be computed via an external PDE solver
# For this stub, we define a mock loss function based on "distance from target"
# (Here just a placeholder quadratic penalty function)

# Simulated field response (mocked for now)
param sim_field {i in INDEX, j in INDEX} :=
[ (i,j) in INDEX cross INDEX ] 0.2;

# Loss function (mean squared error between sim_field and target)
var loss;

s.t. loss_definition:
    loss = (1 / (card(INDEX)^2)) * 
           sum {i in INDEX, j in INDEX}
               (sim_field[i,j] - target_field[i,j])^2;

# Outer-level objective: minimize the loss
minimize outer_obj: loss;

# === Optional: bounds, constraints ===
# s.t. total_energy: sum {i in INDEX, j in INDEX} source[i,j] <= 1.0;

# ==== End ====
