export default function FAQ() {
  return (
    <div className="container" style={{ padding: "100px 0" }}>
      <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
        Frequently Asked Questions
      </h1>

      <Question 
        q="How accurate is DeepShield?"
        a="DeepShield uses trained deep learning models and provides confidence-based predictions."
      />

      <Question 
        q="Are uploaded files stored?"
        a="No. Uploaded files are processed temporarily and not permanently stored."
      />

      <Question 
        q="Can DeepShield detect all deepfakes?"
        a="While highly accurate, no AI system guarantees 100% detection."
      />

      <Question 
        q="Is my data secure?"
        a="Yes. Files are processed securely and deleted after analysis."
      />

      <Question 
        q="Does it support video analysis?"
        a="No. but it will become more advance to do video analysis."
      />
    </div>
  );
}

function Question({ q, a }) {
  return (
    <div className="glass" style={{ padding: "30px", marginBottom: "20px" }}>
      <h3>{q}</h3>
      <p style={{ opacity: 0.7 }}>{a}</p>
    </div>
  );
}
