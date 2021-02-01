export default class Messager {
    constructor(urlSSE) {
        this.urlSSE = urlSSE;
        this.eventSource = new EventSource(urlSSE);
        this.elementForMessagesInDOM = null;
    }
    bindInDom() {
        const container = document.querySelector('[data-section=messager]');
        container.insertAdjacentHTML('beforeend', `
        <div class="messager">
        <h3>Игра</h3>
        <div data-area="list-messages"></div>
        </div>
        `);
        this.elementForMessagesInDOM = container.querySelector('[data-area=list-messages]');
    }
    subscribeToSSE() {
        this.eventSource.addEventListener('action', (evt) => {
            this.pushMessageInDom(evt.type, evt.data);
          });
          this.eventSource.addEventListener('freekick', (evt) => {
              this.pushMessageInDom(evt.type, evt.data);
            });
            this.eventSource.addEventListener('goal', (evt) => {
                this.pushMessageInDom(evt.type, evt.data);
            });
            this.eventSource.addEventListener('open', (evt) => {
            console.log('connected');
          });
          this.eventSource.addEventListener('error', (evt) => {
            console.log('error');
          });
    }
    pushMessageInDom(type, data) {
        this.elementForMessagesInDOM.insertAdjacentHTML('beforeend', `
        ${type === 'goal' ? '&#9917' : ''}
        ${type === 'freekick' ? '!!!' : ''}
        <div>${JSON.parse(data).field}</div>
        `);
    }

}