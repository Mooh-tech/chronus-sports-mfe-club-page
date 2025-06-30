<template>
  <div class="row m-auto club-cheerleaders mt-5">
    <div class="col-12 col-md-5 mb-3 text-center shirt">
      <img src="@/assets/camisa.png" class="img-fluid"/>
    </div>
    <div class="col-12 col-md-7 mb-3">
      <h1 class="cheerleaders-header">NOSSA TORCIDA</h1>
      <p class="cheerleader-text">

      </p>
      <div class="row cheearleader-numbers">
        <div class=" col-12 col-md-4  ">
          <h1>280k</h1>
          <p>Torcida</p>
        </div>
        <div class=" col-12 col-md-4  ">
          <h1>2k</h1>
          <p>Sócios torcedores</p>
        </div>
        <div class=" col-12 col-md-4  ">
          <h1>4.7k</h1>
          <p>Público por jogo</p>
        </div>
        <div class="col-12">
          <p class="mascote"><strong>MASCOTE:</strong> Carcará</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cheerleaders-header {
  font-family: 'Outfit';
  font-weight: 900;
  color: #fff;
  margin-bottom: 2rem;
  font-size: 3rem;
  text-align: center;
}

.cheearleader-numbers h1 {
  font-size: 3rem;
  font-family: 'Outfit';
  font-weight: 900;
  color: #fff;
  text-align: left;
  margin-bottom: 0;

}

.cheearleader-numbers p {
  color: #00E4FF;
  text-align: left;
  font-family: 'Inter';
  font-weight: bold;
  font-size: 1.25rem;
}

.mascote{
  margin-top: 2rem;
  font-family: 'Inter';
  font-size: 1.25rem;
}

.mascote strong{
  color: #fff;
  font-family: 'Outfit';
}

.shirt::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%;
  height: 70%;
  border-radius: 100%;
  background: #07749c;
  z-index: 1;
  filter: blur(195px);
  transform: translate(-50%, -50%);
}
.shirt {
  position: relative;
}
.shirt img{
  position: relative;
  z-index: 1;
}
@media screen and (max-width: 991px){
  .cheearleader-numbers h1,
  .cheearleader-numbers p{
    text-align: center;
  }
}
</style>