// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function meRoute(req, res) {
  res
    .status(200)
    .json({ name: "Panthaweekan Somngam", studentId: "640612093" });
}
