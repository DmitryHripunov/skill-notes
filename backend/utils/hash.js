import crypto from 'node:crypto'

const hash = (d) => (d ? crypto.createHash("sha256").update(d).digest("hex") : null);

export default hash;
