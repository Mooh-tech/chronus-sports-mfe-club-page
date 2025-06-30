<template>
  <div class="row m-auto club-performance">
    <div class="col-12 col-md-7 mb-3 text-center">
      <h1 class="club-performance-header">Desempenho esportivo</h1>
    </div>
    <div class="col-12 col-md-5 mb-3">
      <h1 class="club-performance-header text-end">2024</h1>
    </div>
    <div class="col-12 col-md-7 mb-3 games-wrapper">
      <div class="total-games">
        <div class="total-games-wrapper">
          599
          <span class="total-games-helper">JOGOS</span>
        </div>

      </div>
    </div>
    <div class="col-12 col-md-5 mb-3 club-performance-progress">
      <div class="progress-header">
        <h1>
          PROGRESO DA TEMPORADA
        </h1>
      </div>
      <div class="progress-goals row">
        <div class="col-6">
          <h1 class="goals">673</h1>
          <p class="goals-text">Gols marcados</p>
        </div>
        <div class="col-6">
          <h1 class="goals">710</h1>
          <p class="goals-text">Gols sofridos</p>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-7 mb-3 ">
      <div class="performance-divider"></div>
      <div class="row games">
        <div class="game-number-quantity win-quantity col-12 col-md-4 d-flex mb-2">
          <div class="game-number-wrapper">
            <div class="game-number">
              211
            </div><br>
            <div class="game-type">
              Vitórias
              <span class="game-percentage">
                35,22%
              </span>
            </div>
          </div>
        </div>
        <div class="game-number-quantity draw-quantity col-12 col-md-4 d-flex mb-2">
          <div class="game-number-wrapper">
            <div class="game-number">
              226
            </div><br>
            <div class="game-type">
              Derrotas
              <span class="game-percentage">
                37,73%
              </span>
            </div>
          </div>

        </div>
        <div class="game-number-quantity lost-quantity col-12 col-md-4 d-flex mb-2">
          <div class="game-number-wrapper">
            <div class="game-number">
              162
            </div><br>
            <div class="game-type">
              Empates
              <span class="game-percentage">
                27,05%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped>
.total-games {
  font-family: 'Outfit';
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  margin: auto;
  background: url(http://localhost:8081/35f7115491601bfc5bf7.png);
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-size: auto;
  text-align: center;
  margin-top: 1rem;
  width: 250px;
  height: 250px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.total-games-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.total-games-helper {
  font-family: 'Outfit';
  font-size: 1.3rem;
  color: #fff;
  font-weight: 900;
  display: block;
  margin-top: -.5rem;
}

.game-number {
  display: inline-block;
  font-family: 'Outfit';
  font-size: 2.5rem;
  color: #fff;
  font-weight: 900;
}

.game-number-wrapper {
  margin-left: 1rem;
}

.game-type {
  display: inline-block;
  font-family: 'Inter';
  font-size: 1rem;
  color: #fff;
  font-weight: 400;
}

.game-number-quantity {
  position: relative;
  padding-left: 20px;
}

.game-number-quantity::before {
  content: '';
  width: 5px;
  border-radius: 3px;
  height: 100%;
  background: gray;
  top: 0;
  left: 0;
  display: inline-block;
}

.game-number-quantity.win-quantity::before {
  background: #00E4FF;
}

.game-number-quantity.draw-quantity::before {
  background: #164092;
}

.game-number-quantity.lost-quantity::before {
  background: #CF2D2D;
}

.club-performance {
  padding: 2rem;
}

.win-quantity .game-percentage {
  color: #4ADF3A
}

.lost-quantity .game-percentage {
  color: #CF2D2D
}

.progress-header h1 {
  font-family: 'Outfit';
  font-size: 1.3rem;
  font-weight: 900;
  color: #CAC8DA;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1
}

.club-performance-progress::before {
  content: '';
  background: linear-gradient(80.65deg, #133780 5.25%, #2358C1 100.74%);
  opacity: 0.2;
  border-radius: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.club-performance-progress {
  text-align: center;
  position: relative;
  padding: 2rem;
  position: relative;
  z-index: 1
}

.goals {
  font-family: 'Outfit';
  font-size: 2rem;
  color: #fff;
  font-weight: 900;
  position: relative;
  z-index: 1
}

.goals-text {
  font-family: 'Inter';
  font-size: 1rem;
  color: #fff;
}

.games-wrapper {
  position: relative;
  z-index: 1;
}

.performance-divider {
  height: 1px;
  background: #164092;
  margin-top: 2rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

@media screen and (max-width: 991px) {
  .game-number-quantity {
    margin-bottom: 3rem !important;
    padding-left: 0;
    padding-right: 0;
    text-align: center;
    padding-bottom: 1rem;
  }

  .game-number-wrapper {
    text-align: center;
    margin: auto;
  }

  .game-number-quantity::before {
    height: 5px;
    width: 50px;
    position: absolute;
    bottom: -5px;
    top: auto;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .club-performance-header{
    text-align: center !important;
  }
  .games-wrapper{
    margin-bottom: 3rem !important;
  }
}
</style>