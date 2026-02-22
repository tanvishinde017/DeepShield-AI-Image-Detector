import { useEffect, useState } from "react";

export default function ExampleSection() {
  const [images, setImages] = useState({
    real1: "",
    fake: "",
    real2: "",
  });

  const generateImages = () => {
    setImages({
      real1: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 90
      )}.jpg`,
      fake: `https://thispersondoesnotexist.com/?${Date.now()}`, // AI face
      real2: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 90
      )}.jpg`,
    });
  };

  useEffect(() => {
    generateImages();
    const interval = setInterval(generateImages, 5000);
    return () => clearInterval(interval);
  }, []);

  const examples = [
    {
      id: 1,
      type: "Real",
      confidence: "97%",
      description:
        "Natural skin texture and consistent lighting patterns detected.",
      image: images.real1,
    },
    {
      id: 2,
      type: "Fake (AI Generated)",
      confidence: "92%",
      description:
        "GAN artifacts and synthetic texture blending identified.",
      image: images.fake,
    },
    {
      id: 3,
      type: "Real",
      confidence: "95%",
      description:
        "Authentic facial symmetry and organic shadow gradients verified.",
      image: images.real2,
    },
  ];

  return (
    <section style={{ padding: "100px 0" }}>
      <div
        className="container"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(0,191,255,0.3)",
          borderRadius: "20px",
          padding: "60px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "50px",
            fontSize: "32px",
            fontWeight: "800",
          }}
        >
          Real vs AI Face Detection Examples
        </h2>

        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {examples.map((example) => (
            <div
              key={example.id}
              style={{
                width: "300px",
                textAlign: "center",
              }}
            >
              <img
                src={example.image}
                alt="face example"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "15px",
                  marginBottom: "20px",
                }}
              />

              <h3
                style={{
                  color:
                    example.type.includes("Fake")
                      ? "#ff003c"
                      : "#00ff88",
                  marginBottom: "10px",
                }}
              >
                {example.type}
              </h3>

              <p style={{ marginBottom: "8px" }}>
                Confidence: {example.confidence}
              </p>

              <p style={{ fontSize: "14px", opacity: 0.8 }}>
                {example.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}