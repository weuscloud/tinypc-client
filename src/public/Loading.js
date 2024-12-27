/**
 * @description 加载中组件
 * @usage 进度条样式下，百分比和消息显示在一起
 * @usage 圆环样式下，百分比显示在圆环中间，消息显示在圆环下方
 */
class Loading {
    constructor(type = 'bar', msg = '游戏加载中') {
        if (Loading.instance) {
            return Loading.instance;
        }
        Loading.instance = this;
        this.type = type;
        this.msg = msg;
        this._percentage_enabled = true;
        this._text_enabled = this.type === 'circle' ? true : false;
        this.progress = 0;
        this.init();
        this.percentageElement = this.mask.querySelector(`.loading-percentage-${this.type}`);
        this.fillBarElement = this.mask.querySelector('.loading-fill-bar');
        this.msgElement = this.mask.querySelector('.loading-msg');
        this.loadingPercentageCircle = this.mask.querySelector('.loading-percentage-circle');

    }
    render(type = 'circle', msg = '加载中') {
        return `<div class="loading-mask">
      <div class="loading-container">
      <div class="loading-${type}">${type === 'bar' ? `<div class="loading-fill-bar"></div>` : ''}</div>
      <div class=" ${this._percentage_enabled ? 'show' : 'hide'} loading-percentage-${type}"></div>
      </div>
      <div class="loading-msg ${this._text_enabled ? 'show' : 'hide'}">${msg}...</div>
      </div>`;
    }
    createMask() {
        let mask = document.createElement('div');
        mask.className = 'loading-mask';
        this.mask = mask;
        document.body.appendChild(mask);
        return mask;
    }
    setProgress(progress) {
        if (!this.mask) {
            return;
        }
        const percentageElement = this.percentageElement;

        if (percentageElement) {
            //进度条为和百分比在一起显示
            if (this.type === 'bar') {
                percentageElement.textContent = `${this.msg}...${progress}%`;
                const fillBarElement = this.mask.querySelector('.loading-fill-bar');
                fillBarElement.style.width = `${progress}%`;
            }
            //圆环模式为下方显示消息
            else if (this._percentage_enabled) {
                percentageElement.textContent = `${progress}`;
            }
        }

    }
    init() {
        if (!this.mask) {
            this.mask = this.createMask();
            this.mask.innerHTML = this.render(this.type,this.msg);
            const msgElement = this.msgElement;
            try {
                //圆环下方显示消息
                this._modify_classlist(msgElement, this._text_enabled);

                //显示百分比
                this._modify_classlist(this.loadingPercentageCircle, this._percentage_enabled)
            } catch (error) {
                console.log(error);
            }
        }
    }

    show() {
        if (!this.mask) {
            this.init();
        }
        this._modify_classlist(this.mask, false);
    }
    finish() {
        clearInterval(this.timer);
        if (!this.mask) {
            this.init();
        }
        this._modify_classlist(this.mask, true);
        this.progress = 99;
    }
    _modify_classlist(el, disabled = true) {
        if (!el || !el.classList) return;
        if (disabled) {
            el.classList.remove('show');
            el.classList.add('hide');
        } else {
            el.classList.remove('hide');
            el.classList.add('show');
        }
    }
    waitting() {
        clearInterval(this.timer);
        this.progress = 20;
        this.show();
        this.timer=setInterval(() => {
            if (this.progress >= 100) {
                this.progress = 0;
            }
            this.progress += 20;
            this.setProgress(this.progress);
        }, 100)
    }
}
