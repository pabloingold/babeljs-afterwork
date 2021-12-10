function render() {
  return html`
	<my-input-component
		@input=${e => {this._searchTyped(e.target.value)}}
		.modelValue="${this._searchReset}"
        <my-icon-component
            slot="prefix"
            .svg=${'<svg focusable=false viewBox="0 0 800 800" xmls="https://w3.org/2000/svg"><path d="M466.00090000909098"></path></svg>'}
            aria-label="search">
        </my-icon-component>
		<my-icon-component
            slot="prefix"
            .svg=${'<svg focusable=false viewBox="0 0 800 800" xmls="https://w3.org/2000/svg"><path d="M466.00090000909098"></path></svg>'}
            class="resetIcon ${this.search ? '' : 'disabled'}"
			@onClick="${ () => { this._clickReset(); } }"
			aria-label="search">
        </my-icon-component>
	</my-input-component>
  `;
}