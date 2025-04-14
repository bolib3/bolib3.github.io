import numpy as np
from numba import njit
from scipy.optimize import minimize

# Simulation parameters
N = 128
dt = 0.01
dx = 1.0
alpha = 0.1
iterations = 100

# Target field we want to match
target_field = np.zeros((N, N), dtype=np.float32)
target_field[N // 4 : N // 2, N // 4 : N // 2] = 1.0  # Block target


@njit
def diffusion_kernel(field, source, alpha, dt, dx, steps):
    for _ in range(steps):
        new_field = field.copy()
        for i in range(1, field.shape[0] - 1):
            for j in range(1, field.shape[1] - 1):
                laplacian = (
                    field[i + 1, j]
                    + field[i - 1, j]
                    + field[i, j + 1]
                    + field[i, j - 1]
                    - 4.0 * field[i, j]
                ) / (dx * dx)
                new_field[i, j] = field[i, j] + dt * (alpha * laplacian + source[i, j])
        field[:] = new_field
    return field


def inner_objective(source_flat):
    source = source_flat.reshape((N, N))
    field = np.zeros((N, N), dtype=np.float32)
    result = diffusion_kernel(field, source, alpha, dt, dx, iterations)
    loss = np.mean((result - target_field) ** 2)
    return loss


# Initial guess for the source (flattened)
initial_source = np.random.randn(N * N) * 0.01

# Outer optimization: find the source that matches the target
result = minimize(
    inner_objective, initial_source, method="L-BFGS-B", options={"maxiter": 20}
)

# Reshape optimized source
optimized_source = result.x.reshape((N, N))

print(f"Outer optimization complete. Final loss: {result.fun:.6f}")
