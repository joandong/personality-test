"use client"

import { useState } from "react"
import { questions, archetypeQuestions, archetypeDescriptions } from "../data/testData"

export const PersonalityTest = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (questionNumber: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }))
  }

  const calculateScores = () => {
    const scores: Record<string, number> = {}
    for (const [archetype, questionNumbers] of Object.entries(archetypeQuestions)) {
      scores[archetype] = questionNumbers.reduce((sum, q) => sum + (answers[q] || 0), 0)
    }
    return scores
  }

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert(`还有 ${questions.length - Object.keys(answers).length} 道题目未回答，请完成所有问题后再提交。`)
      return
    }
    setShowResults(true)
  }

  const renderQuestion = (question: string, index: number) => (
    <div key={index} className="question">
      <p>
        {index + 1}. {question}
      </p>
      <div className="options">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleAnswer(index + 1, value)}
            className={`option ${answers[index + 1] === value ? "selected" : ""}`}
          >
            {["从来没有", "很少", "有时", "时常", "总是"][value - 1]}
          </button>
        ))}
      </div>
    </div>
  )

  const renderResults = () => {
    const scores = calculateScores()
    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a)

    return (
      <div className="results">
        <div className="notice-section">
          <h3>测试结果解读说明</h3>
          <div className="notice-content">
            <p className="important-notice">记住，没有一个原型比别的原型"好"或者"坏"，每种类型都有其独特的特征。</p>

            <h4>分数范围说明：</h4>
            <ul>
              <li>高分区间（24-30分）：表示该原型在当前生活中非常活跃</li>
              <li>中等区间（16-23分）：表示该原型具有正常影响力</li>
              <li>低分区间（6-15分）：表示该原型可能被压抑或忽视</li>
            </ul>

            <h4>如何理解您的测试结果：</h4>
            <ul>
              <li>关注得分最高的2-3个原型，它们代表您当前最主要的性格特征</li>
              <li>注意得分最低的原型，它们可能代表需要发展的潜能领域</li>
              <li>结果仅供参考，重要的是促进自我认知和个人成长</li>
            </ul>
          </div>
        </div>

        <div className="results-section">
          <h3>原型分布分析</h3>
          <div className="archetype-results">
            {sortedScores.map(([archetype, score]) => {
              const desc = archetypeDescriptions[archetype as keyof typeof archetypeDescriptions]
              const scoreLevel = score >= 24 ? "high-score" : score >= 16 ? "medium-score" : "low-score"
              return (
                <div key={archetype} className={`archetype-result ${scoreLevel}`}>
                  <h3>{desc.title}</h3>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${(score / 30) * 100}%` }}></div>
                    <span className="score-text">{score}/30</span>
                  </div>
                  <div className="interpretation">
                    <p>
                      <strong>核心特质：</strong>
                      {desc.traits}
                    </p>
                    <p>
                      <strong>主要表现：</strong>
                    </p>
                    <ul>
                      {desc.positive.map((trait, index) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                    <p className="score-interpretation">
                      {score >= 24
                        ? "这个原型在您的生命中非常活跃，是您性格的重要组成部分。"
                        : score >= 16
                          ? "这个原型在您的生命中有适度的影响力，处于平衡状态。"
                          : "这个原型在您的生命中较不活跃，可能需要更多关注和发展。"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="result-actions">
          <button onClick={() => setShowResults(false)} className="restart-btn">
            重新测试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>十二人格原型测试</h1>
      <p>请尽可能快速作答，通常您的第一个反应是最正确的。</p>

      {!showResults ? (
        <>
          <div id="test-form">{questions.map(renderQuestion)}</div>
          <button className="submit-btn" onClick={handleSubmit}>
            提交测试
          </button>
        </>
      ) : (
        renderResults()
      )}
    </div>
  )
}

