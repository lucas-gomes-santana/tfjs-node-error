# TFJS Node Error (#8746 Issue)

A minimal reproduction of a `@tensorflow/tfjs-node` dependency failure that depends on the
installed **Node.js version**. The same script runs successfully on Node 20 but
crashes on newer Node.js versions. More info: https://github.com/tensorflow/tfjs/issues/8746

## Requirements

- **nvm** (Node Version Manager) — https://github.com/nvm-sh/nvm
- A shell (bash/zsh) — optional: also works without nvm if you can install Node manually.

---

## 1. Install Node with nvm

### 1.1 Install nvm

If you don't have nvm yet, install it with the official script:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Then reload your terminal:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Verify the installation:

```bash
nvm --version
```

### 1.2 Install and activate a specific Node version

Install Node 20 (recommended, see [Why Node 20?](#why-node-20)):

```bash
nvm install 20
```

Activate it for the current terminal session:

```bash
nvm use 20
```

Confirm the active version:

```bash
node -v
```

The project has already a .nvmrc file to you switch to version 20 or other of your preference:

```bash
nvm use
```

---

## 2. Install the dependencies

Make sure you are using the target Node version, then install:

```bash
npm install @tensorflow/tfjs-node
```

This downloads and builds/links `@tensorflow/tfjs-node` (which includes a native
binary via `node-pre-gyp`). The dependency installed in this project is:

```json
"dependencies": {
  "@tensorflow/tfjs-node": "^4.22.0"
}
```

---

## 3. Run the script

```bash
node index.js
```

The script:

1. Builds a `3 x 4` database tensors and a `4`-element target descriptor.
2. Computes cosine similarity between the target and each database row.
3. Prints the three similarity values.

---

## 4. Observed behavior per Node version

### Node v20 works

```text
❯ node index.js
2026-09-22 13:37:22.283788: I tensorflow/core/platform/cpu_feature_guard.cc:193] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
Node version: v20.20.2
TFJS version: 4.22.0

Similarity Values:
[ 0.9992372989654541, 0.9991744756698608, 0.525580644607544 ]

~/tfjs_node_error
❯
```

### Node v26.9.0 (or any other version > 22) fails

```text
❯ node index.js
2026-09-22 13:40:39.907562: I tensorflow/core/platform/cpu_feature_guard.cc:193] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
Node version: v26.9.0
TFJS version: 4.22.0

Error caught during TFJS execution:
TypeError: (0 , util_1.isNullOrUndefined) is not a function
    at createTensorsTypeOpAttr (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-node/dist/nodejs_kernel_backend.js:675:38)
    at Object.kernelFunc (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-node/dist/kernels/BatchMatMul.js:30:65)
    at kernelFunc (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-core/dist/tf-core.node.js:4707:32)
    at /home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-core/dist/tf-core.node.js:4767:27
    at Engine.scopedRun (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-core/dist/tf-core.node.js:4572:23)
    at Engine.runKernelFunc (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-core/dist/tf-core.node.js:4763:14)
    at Engine.runKernel (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs-core/dist/tf-core.node.js:4636:21)
    at matMul_ (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs/dist/tf.node.js:5833:19)
    at matMul__op (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs/dist/tf.node.js:4027:28)
    at getGlobalTensorClass.matMul (/home/lucas/tfjs_node_error/node_modules/@tensorflow/tfjs/dist/tf.node.js:32818:12)

~/tfjs_node_error
❯
```
