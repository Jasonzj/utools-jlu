import Nanobar from 'nanobar'

export let loadingBar: null | Nanobar = null

export const initializeLoadingBar = (): void => {
  loadingBar = new Nanobar()

  document.getElementById('nanobarcss').innerHTML = `
    .nanobar {
        width:100%;
        height:2px;
        z-index:99999;
        top:0
    }
    .bar {
        width:0;
        height:100%;
        transition:height .3s;
        background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%)
    }
  `
}
