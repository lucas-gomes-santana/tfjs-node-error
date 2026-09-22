import * as tf from "@tensorflow/tfjs-node";

async function run() {
  console.log(`Node version: ${process.version}`);
  console.log(`TFJS version: ${tf.version.tfjs}`);

  const databaseDescriptors = [
    [0.12, 0.34, 0.56, 0.78],
    [0.22, 0.44, 0.66, 0.88],
    [0.91, 0.11, 0.21, 0.31],
  ];

  const targetDescriptor = [0.15, 0.35, 0.55, 0.75];

  const dbTensor = tf.tensor2d(databaseDescriptors);
  const targetTensor = tf.tensor1d(targetDescriptor);

  try {
    const targetExpanded = targetTensor.expandDims(1);
    const dotProduct = dbTensor.matMul(targetExpanded).squeeze(); // Result: [3]

    // It's likely that the 'isNullOrUndefined' error will be thrown here,
    // as tf.norm invokes kernels like Abs under the hood.
    const dbNorm = dbTensor.norm("euclidean", 1);
    const targetNorm = targetTensor.norm("euclidean");

    const denominator = dbNorm.mul(targetNorm);
    const cosineSimilarities = dotProduct.div(denominator);

    const result = await cosineSimilarities.array();

    console.log("\nSimilarity Values:");
    console.dir(result);

    tf.dispose([
      dbTensor,
      targetTensor,
      targetExpanded,
      dotProduct,
      dbNorm,
      targetNorm,
      denominator,
      cosineSimilarities,
    ]);
  } catch (error) {
    console.error("\nError caught during TFJS execution:");
    console.error(error);
  }
}

run();
