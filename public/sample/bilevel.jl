using LinearAlgebra
using Optim
using Random

# Simulation parameters
N = 128
dt = 0.01
dx = 1.0
α = 0.1
iterations = 100

# Create target field (block in upper-left)
target_field = zeros(Float32, N, N)
target_field[div(N,4):div(N,2), div(N,4):div(N,2)] .= 1.0f0

# Diffusion solver
function diffusion_kernel(field::Array{Float32,2}, source::Array{Float32,2},
                          α, dt, dx, steps)
    N = size(field, 1)
    for step = 1:steps
        new_field = copy(field)
        for i in 2:N-1, j in 2:N-1
            laplacian = (field[i+1,j] + field[i-1,j] + field[i,j+1] + field[i,j-1]
                         - 4.0f0 * field[i,j]) / (dx^2)
            new_field[i,j] = field[i,j] + dt * (α * laplacian + source[i,j])
        end
        field .= new_field
    end
    return field
end

# Inner loss function
function inner_objective(source_flat::Vector{Float64})
    source = reshape(Float32.(source_flat), N, N)
    field = zeros(Float32, N, N)
    result = diffusion_kernel(field, source, α, dt, dx, iterations)
    return mean((result .- target_field).^2)
end

# Initial guess for the source
Random.seed!(42)
initial_source = 0.01 .* randn(N * N)

# Optimize using BFGS
result = optimize(inner_objective, initial_source, BFGS(); iterations=20)
optimized_source = reshape(Float32.(result.minimizer), N, N)

println("Outer optimization complete. Final loss: $(result.minimum)")