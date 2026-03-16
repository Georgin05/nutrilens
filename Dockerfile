# Use the official Antigravity Base (includes Node, Python, and Git)
FROM google/antigravity-agent-base:2026-stable

# Set the working directory
WORKDIR /app

# Copy your project files into the container
COPY . .

# Pre-install your dependencies so the new agent doesn't have to
# (Uncomment the one you need)
# RUN npm install
# RUN pip install -r requirements.txt

CMD ["bash"]