export default function FAQ() {
  return (
    <div className="container faq-section">
      <h1 className="faq-title">Frequently Asked Questions</h1>

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
        a="Currently no, but future versions will include advanced video analysis support."
      />
    </div>
  );
}

function Question({ q, a }) {
  return (
    <div className="glass-card">
      <h3 className="faq-question">{q}</h3>
      <p className="faq-answer">{a}</p>
    </div>
  );
}