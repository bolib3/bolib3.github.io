% Bilevel Optimization in MATLAB

% Simulation parameters
N = 128;
dt = 0.01;
dx = 1.0;
alpha = 0.1;
iterations = 100;

% Target field
target_field = zeros(N, N);
target_field(N/4:N/2, N/4:N/2) = 1.0;  % Block target

% Initial source guess
initial_source = 0.01 * randn(N, N);

% Inner diffusion solver
function field = diffusion_kernel(field, source, alpha, dt, dx, steps)
    N = size(field, 1);
    for step = 1:steps
        new_field = field;
        for i = 2:N-1
            for j = 2:N-1
                laplacian = (field(i+1,j) + field(i-1,j) + ...
                             field(i,j+1) + field(i,j-1) - ...
                             4 * field(i,j)) / (dx * dx);
                new_field(i,j) = field(i,j) + dt * (alpha * laplacian + source(i,j));
            end
        end
        field = new_field;
    end
end

% Inner objective function
function loss = inner_objective(source_flat, N, target_field, alpha, dt, dx, iterations)
    source = reshape(source_flat, [N, N]);
    field = zeros(N, N);
    result = diffusion_kernel(field, source, alpha, dt, dx, iterations);
    loss = mean((result(:) - target_field(:)).^2);
end

% Wrapper for optimizer
objective_handle = @(s) inner_objective(s, N, target_field, alpha, dt, dx, iterations);

% Run outer optimization
options = optimoptions('fminunc', 'Algorithm', 'quasi-newton', 'MaxIterations', 20, 'Display', 'iter');
initial_flat = initial_source(:);
[result_source, final_loss] = fminunc(objective_handle, initial_flat, options);

% Reshape optimized source
optimized_source = reshape(result_source, [N, N]);

fprintf('Outer optimization complete. Final loss: %.6f\n', final_loss);

% Visualization (optional)
% imagesc(optimized_source); colorbar; title('Optimized Source');
