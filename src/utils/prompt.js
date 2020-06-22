const { stdin, stdout } = process;

export function prompt(question) {
  return new Promise((resolve, reject) => {
    stdin.resume();
    stdout.write(`${question}\n`);

    stdin.on("data", (data) => resolve(data.toString().trim()));
    stdin.on("error", (err) => reject(err));
  });
}
