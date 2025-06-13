import React, { useState, useEffect } from 'react';

const MemoramaFrases = () => {
  const [count, setCount] = useState(0);
  const [inputs, setInputs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    let timer;
    if (submitted && !gameFinished) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [submitted, gameFinished, startTime]);

  // Detectar cuando se termina el juego
  useEffect(() => {
    if (submitted && matched.length === cards.length && cards.length > 0) {
      setGameFinished(true);
    }
  }, [matched, cards, submitted]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const generateCards = () => {
    const allPhrases = inputs.flatMap((text) => [text, text]);
    const shuffled = allPhrases
      .map((text) => ({ text, id: Math.random() }))
      .sort(() => 0.5 - Math.random());
    setCards(shuffled);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].text === cards[second].text) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  const handleSubmitCount = () => {
    if (count > 0) {
      setInputs(Array(Number(count)).fill(''));
    }
  };

  const handleStartGame = () => {
    if (inputs.every(text => text.trim() !== '')) {
      setSubmitted(true);
      setStartTime(Date.now());
      setElapsedTime(0);
      generateCards();
    } else {
      alert("Vervollständigen Sie alle Wörter.");
    }
  };

  return (
    <div className="container py-4">
      {!inputs.length && (
        <div className="text-center">
          <h2 className="mb-3">Wie viele Wortpaare möchten Sie verwenden?</h2>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min={1}
            className="form-control w-25 mx-auto"
          />
          <button className="btn btn-primary mt-3" onClick={handleSubmitCount}>Akzeptieren</button>
        </div>
      )}

      {!submitted && inputs.length > 0 && (
        <div>
          <h3 className="mb-3 text-center">Geben Sie die Wörter ein</h3>
          <div className="row">
            {inputs.map((text, idx) => (
              <div className="col-md-4 mb-2" key={idx}>
                <input
                  type="text"
                  className="form-control"
                  value={text}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  placeholder={`Wort ${idx + 1}`}
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="btn btn-success mt-3" onClick={handleStartGame}>Memorama starten</button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="mt-4 text-center">
          <h4 className="mb-3">Zeit: <span className="badge bg-secondary">{elapsedTime} Sekunden</span></h4>

          <div
            className="d-grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`,
              display: 'grid',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className="card p-3"
                  style={{
                    backgroundColor: isFlipped ? '#f8f9fa' : '#ff4242',
                    color: isFlipped ? '#000' : 'transparent',
                    cursor: 'pointer',
                    minHeight: '80px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {card.text}
                </div>
              );
            })}
          </div>

          {gameFinished && (
            <div className="alert alert-success mt-4">
              Herzlichen Glückwunsch! Du hast das Spiel abgeschlossen in <strong>{elapsedTime}</strong> Sekunden.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoramaFrases;
