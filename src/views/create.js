import html from 'choo/html'
import colorHistoryView from './colorHistory'
import savingView from './saving'
import successView from './success'
import wilsonLib from '../lib/wilson'
import Sticky from 'sticky-js'
import colors from '../lib/colors'

export default function createView(state, emit) {
  return html`
    <div class="content">
      <div class="card">Utilisez la palette pour sélectioner une couleur, puis cliquez sur Wilson pour le colorier</div>
      <div class="card toolbox">
        <div>
          Choix des couleurs :
          ${colorHistoryView(
            colors,
            emit,
            state.selectedColor,
          )}
          <div>
            Couleurs utilisées :
            ${colorHistoryView(
              state.previousColors,
              emit
            )}
          </div>
        </div>
        <div>
          <button class="btn" onclick=${resetButtonClick}>Réinitialiser</button>
          <button class="btn btn-save" onclick=${saveButtonClick}>Enregistrer</button>
        </div>
      </div>
      ${state.saving.isSaving ? savingView(state, emit) : null}
      ${state.success ? successView(state, emit) : null}
      <div class="wilson-container">
        <object id="wilson" data="images/wilson.svg" type="image/svg+xml" onload=${wilsonLoaded}></object>
      </div>
    </div>
  `

  function colorInputChanged(event) {
    emit('colorSelected', event.target.value)
  }

  function resetButtonClick() {
    window.location.reload()
  }

  function saveButtonClick() {
    emit('save:visible', true)
  }

  function wilsonLoaded() {
    initSticky()
    wilsonLib.getShapes().forEach(function(shape) {
      shape.onclick = function(event) {
        if (event.currentTarget.id !== 'path1019') {
          emit('paint', {
            elementId: event.currentTarget.id,
            color: state.selectedColor
          })
        }
      }
    })
    wilsonLib.repaint(state.wilson)
  }

  function initSticky() {
    const stickyToolbox = new Sticky('.toolbox')
    return stickyToolbox
  }
}
