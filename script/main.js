/*
 * botui 0.3.9
 * A JS library to build the UI for your bot
 * https://botui.org
 *
 * Copyright 2019, Moin Uddin
 * Released under the MIT license.
 */
(function (a, b) {
    "use strict";
    "function" == typeof define && define.amd ? define([], function () {
        return a.BotUI = b(a)
    }) : a.BotUI = b(a)
})("undefined" == typeof window ? this : window, function (a) {
    "use strict";
    return function (b, c) {
        function d(a, b, c, d) {
            var e = d ? "blank" : ""; // check if '^' sign is present with link syntax
            return "<a class='botui-message-content-link' target='" + e + "' href='" + c + "'>" + b + "</a>"
        }

        function e(a) {
            return a.replace(r.image, "<img class='botui-message-content-image' src='$2' alt='$1' />").replace(r.icon, "<i class='botui-icon botui-message-content-icon fa fa-$1'></i>").replace(r.link, d)
        }

        function f(a, b) {
            var c = document.createElement("script");
            c.type = "text/javascript", c.src = a, b && (c.onload = b), document.body.appendChild(c)
        }

        function g(a) {
            t.action.addMessage && q.message.human({
                delay: 100,
                content: a
            }), t.action.show = !t.action.autoHide
        } // to access the component's data
        function h(a) {
            if (!a.loading && !a.content) throw Error("BotUI: \"content\" is required in a non-loading message object.");
            a.type = a.type || "text", a.visible = !(a.delay || a.loading);
            var b = t.messages.push(a) - 1;
            return new Promise(function (c) {
                setTimeout(function () {
                    a.delay && (a.visible = !0, a.loading && (a.loading = !1)), c(b)
                }, a.delay || 0)
            })
        }

        function i(a) {
            return "string" == typeof a && (a = {
                content: a
            }), a || {}
        }

        function j(a, b) {
            for (var c in a) b.hasOwnProperty(c) || (b[c] = a[c])
        }

        function k(a) {
            if (!a.action && !a.actionButton && !a.actionText) throw Error("BotUI: \"action\" property is required.")
        }

        function l(a) {
            return k(a), j({
                type: "text",
                cssClass: "",
                autoHide: !0,
                addMessage: !0
            }, a), t.action.type = a.type, t.action.cssClass = a.cssClass, t.action.autoHide = a.autoHide, t.action.addMessage = a.addMessage, new Promise(function (b) {
                o = b, setTimeout(function () {
                    t.action.show = !0
                }, a.delay || 0)
            })
        }
        if (c = c || {}, !b) throw Error("BotUI: Container id is required as first argument.");
        if (!document.getElementById(b)) throw Error("BotUI: Element with id #" + b + " does not exist.");
        if (!a.Vue && !c.vue) throw Error("BotUI: Vue is required but not found.");
        var m, n, // methods returned by a BotUI() instance.
            o, // current vue instance.
            p = {
                debug: !1,
                fontawesome: !0,
                searchselect: !0
            }, // the outermost Element. Needed to scroll to bottom, for now.
            q = {},
            r = {
                icon: /!\(([^\)]+)\)/gim, // !(icon)
                image: /!\[(.*?)\]\((.*?)\)/gim, // ![aleternate text](src)
                link: /\[([^\[]+)\]\(([^\)]+)\)(\^?)/gim // [text](link) ^ can be added at end to set the target as 'blank'
            }; // merge opts passed to constructor with _options
        for (var s in a.Vue = a.Vue || c.vue, p) c.hasOwnProperty(s) && (p[s] = c[s]);
        a.Promise || "undefined" != typeof Promise || c.promise || f("https://cdn.jsdelivr.net/es6-promise/4.1.0/es6-promise.min.js");
        a.Vue.directive("botui-markdown", function (a, b) {
            "false" == b.value || ( // v-botui-markdown="false"
                a.innerHTML = e(a.textContent))
        }), a.Vue.directive("botui-scroll", {
            inserted: function (a) {
                n.scrollTop = n.scrollHeight, a.scrollIntoView(!1)
            }
        }), a.Vue.directive("focus", {
            inserted: function (a) {
                a.focus()
            }
        }), a.Vue.directive("botui-container", {
            inserted: function (a) {
                n = a
            }
        }), m = new a.Vue({
            components: {
                "bot-ui": {
                    template: "<div class=\"botui botui-container\" v-botui-container><div class=\"botui-messages-container\"><div v-for=\"msg in messages\" class=\"botui-message\" :class=\"msg.cssClass\" v-botui-scroll><transition name=\"slide-fade\"><div v-if=\"msg.visible\"><div v-if=\"msg.photo && !msg.loading\" :class=\"['profil', 'profile', {human: msg.human, 'agent': !msg.human}]\"> <img :src=\"msg.photo\" :class=\"[{human: msg.human, 'agent': !msg.human}]\"></div><div :class=\"[{human: msg.human, 'botui-message-content': true}, msg.type]\"><span v-if=\"msg.type == 'text'\" v-text=\"msg.content\" v-botui-markdown></span><span v-if=\"msg.type == 'html'\" v-html=\"msg.content\"></span> <iframe v-if=\"msg.type == 'embed'\" :src=\"msg.content\" frameborder=\"0\" allowfullscreen></iframe></div></div></transition><div v-if=\"msg.photo && msg.loading && !msg.human\" :class=\"['profil', 'profile', {human: msg.human, 'agent': !msg.human}]\"> <img :src=\"msg.photo\" :class=\"[{human: msg.human, 'agent': !msg.human}]\"></div><div v-if=\"msg.loading\" class=\"botui-message-content loading\"><i class=\"dot\"></i><i class=\"dot\"></i><i class=\"dot\"></i></div></div></div><div class=\"botui-actions-container\"><transition name=\"slide-fade\"><div v-if=\"action.show\" v-botui-scroll><form v-if=\"action.type == 'text'\" class=\"botui-actions-text\" @submit.prevent=\"handle_action_text()\" :class=\"action.cssClass\"><i v-if=\"action.text.icon\" class=\"botui-icon botui-action-text-icon fa\" :class=\"'fa-' + action.text.icon\"></i> <div class=\"input-container\"><input type=\"text\" ref=\"input\" :type=\"action.text.sub_type\" :step=\"action.text.step\" :min=\"action.text.min\" :max=\"action.text.max\" v-model=\"action.text.value\" class=\"botui-actions-text-input\" :placeholder=\"action.text.placeholder\" :size=\"action.text.size\" :value=\" action.text.value\" :class=\"action.text.cssClass\" :required=\"action.text.required ? true : false\" @input=\"handle_text_change\" v-focus /></div> <button type=\"submit\" :class=\"{'botui-actions-buttons-button': !!action.text.button, 'botui-actions-text-submit': !action.text.button}\"><i v-if=\"action.text.button && action.text.button.icon\" class=\"botui-icon botui-action-button-icon fa\" :class=\"'fa-' + action.text.button.icon\"></i> <span>{{(action.text.button && action.text.button.label) || 'Go'}}</span></button></form><form v-if=\"action.type == 'select'\" class=\"botui-actions-select\" @submit.prevent=\"handle_action_select()\" :class=\"action.cssClass\"><i v-if=\"action.select.icon\" class=\"botui-icon botui-action-select-icon fa\" :class=\"'fa-' + action.select.icon\"></i><v-select v-if=\"action.select.searchselect && !action.select.multipleselect\" v-model=\"action.select.value\" :value=\"action.select.value\" :placeholder=\"action.select.placeholder\" class=\"botui-actions-text-searchselect\" :label=\"action.select.label\" :options=\"action.select.options\"></v-select><v-select v-else-if=\"action.select.searchselect && action.select.multipleselect\" multiple v-model=\"action.select.value\" :value=\"action.select.value\" :placeholder=\"action.select.placeholder\" class=\"botui-actions-text-searchselect\" :label=\"action.select.label\" :options=\"action.select.options\"></v-select> <select v-else v-model=\"action.select.value\" class=\"botui-actions-text-select\" :placeholder=\"action.select.placeholder\" :size=\"action.select.size\" :class=\"action.select.cssClass\" required v-focus><option v-for=\"option in action.select.options\" :class=\"action.select.optionClass\" v-bind:value=\"option.value\" :disabled=\"(option.value == '')?true:false\" :selected=\"(action.select.value == option.value)?'selected':''\"> {{ option.text }}</option></select> <button type=\"submit\" :class=\"{'botui-actions-buttons-button': !!action.select.button, 'botui-actions-select-submit': !action.select.button}\"><i v-if=\"action.select.button && action.select.button.icon\" class=\"botui-icon botui-action-button-icon fa\" :class=\"'fa-' + action.select.button.icon\"></i> <span>{{(action.select.button && action.select.button.label) || 'Ok'}}</span></button></form><div v-if=\"action.type == 'button'\" class=\"botui-actions-buttons\" :class=\"action.cssClass\"> <button type=\"button\" :class=\"button.cssClass\" class=\"botui-actions-buttons-button\" v-botui-scroll v-for=\"button in action.button.buttons\" @click=\"handle_action_button(event, button)\"><i v-if=\"button.icon\" class=\"botui-icon botui-action-button-icon fa\" :class=\"'fa-' + button.icon\"></i> {{button.text}}</button></div><form v-if=\"action.type == 'buttontext'\" class=\"botui-actions-text\" @submit.prevent=\"handle_action_text()\" :class=\"action.cssClass\"><i v-if=\"action.text.icon\" class=\"botui-icon botui-action-text-icon fa\" :class=\"'fa-' + action.text.icon\"></i> <div class=\"input-container\"><input type=\"text\" ref=\"input\" :type=\"action.text.sub_type\" :step=\"action.text.step\" :min=\"action.text.min\" :max=\"action.text.max\" v-model=\"action.text.value\" class=\"botui-actions-text-input\" :placeholder=\"action.text.placeholder\" :size=\"action.text.size\" :value=\"action.text.value\" :class=\"action.text.cssClass\" required v-focus/></div> <button type=\"submit\" :class=\"{'botui-actions-buttons-button': !!action.text.button, 'botui-actions-text-submit': !action.text.button}\"><i v-if=\"action.text.button && action.text.button.icon\" class=\"botui-icon botui-action-button-icon fa\" :class=\"'fa-' + action.text.button.icon\"></i> <span>{{(action.text.button && action.text.button.label) || 'Go'}}</span></button><div class=\"botui-actions-buttons\" :class=\"action.cssClass\"> <button type=\"button\" :class=\"button.cssClass\" class=\"botui-actions-buttons-button\" v-for=\"button in action.button.buttons\" @click=\"handle_action_button(event, button)\" autofocus><i v-if=\"button.icon\" class=\"botui-icon botui-action-button-icon fa\" :class=\"'fa-' + button.icon\"></i> {{button.text}}</button></div></form></div></transition></div></div>", // replaced by HTML template during build. see Gulpfile.js
                    data: function () {
                        return {
                            action: {
                                text: {
                                    size: 30,
                                    placeholder: "Write here .."
                                },
                                button: {},
                                show: !1,
                                type: "text",
                                autoHide: !0,
                                addMessage: !0
                            },
                            messages: []
                        }
                    },
                    computed: {
                        isMobile: function () {
                            return a.innerWidth && 768 >= a.innerWidth
                        }
                    },
                    methods: {
                        handleDoneButtonState: function (a, b) {
                            b = b.find(function (a) {
                                return a.checked
                            });
                            var c = a.currentTarget.parentElement.children,
                                d = c[c.length - 1];
                            b ? (d.innerText = "Confirm", d.classList.add("confirm")) : (d.innerText = "None of these", d.classList.remove("confirm"))
                        },
                        handle_text_change: function (a) {
                            "function" == typeof this.action.text.onChange && this.action.text.onChange(this.action.text.value, a.currentTarget.parentElement)
                        },
                        handle_action_button: function (a, b) {
                            for (var c = 0; c < this.action.button.buttons.length && (b.value || !this.action.multiselect); c++)
                                if (this.action.button.buttons[c].value == b.value) {
                                    if (this.action.multiselect && (this.action.button.buttons[c].checked = !this.action.button.buttons[c].checked, this.handleDoneButtonState(a, this.action.button.buttons)), "function" == typeof this.action.button.buttons[c].event && this.action.button.buttons[c].event(a, b), this.action.button.buttons[c].actionStop) return !1;
                                    break
                                }
                            var d = [],
                                e = [];
                            this.action.multiselect ? (this.action.button.buttons.forEach(a => {
                                a.checked && a.value && (d.push(a.text), e.push(a.value))
                            }), d = d.join(", ")) : (d = b.text, e = b.value), g(d || "None of these Symptoms");
                            var f = {
                                type: "button",
                                text: d,
                                value: e
                            };
                            for (var h in b) b.hasOwnProperty(h) && "type" !== h && "text" !== h && "value" !== h && (f[h] = b[h]);
                            o(f)
                        },
                        handle_action_text: function () {
                            !this.action.text.value && this.action.text.required || (g(this.action.text.value), o({
                                type: "text",
                                value: this.action.text.value
                            }), this.action.text.value = "")
                        },
                        handle_action_select: function () {
                            if (this.action.select.searchselect && !this.action.select.multipleselect) {
                                if (!this.action.select.value.value) return;
                                g(this.action.select.value[this.action.select.label]), o({
                                    type: "text",
                                    value: this.action.select.value.value,
                                    text: this.action.select.value.text,
                                    obj: this.action.select.value
                                })
                            }
                            if (this.action.select.searchselect && this.action.select.multipleselect) {
                                if (!this.action.select.value) return;
                                for (var a = [], b = [], c = 0; c < this.action.select.value.length; c++) a.push(this.action.select.value[c].value), b.push(this.action.select.value[c][this.action.select.label]);
                                g(b.join(", ")), o({
                                    type: "text",
                                    value: a.join(", "),
                                    text: b.join(", "),
                                    obj: this.action.select.value
                                })
                            } else {
                                if (!this.action.select.value) return;
                                for (var c = 0; c < this.action.select.options.length; c++) // Find select title
                                    this.action.select.options[c].value == this.action.select.value && (g(this.action.select.options[c].text), o({
                                        type: "text",
                                        value: this.action.select.value,
                                        text: this.action.select.options[c].text
                                    }))
                            }
                        }
                    }
                }
            }
        }).$mount("#" + b);
        var t = m.$children[0];
        return q.message = {
            add: function (a) {
                return h(i(a))
            },
            bot: function (a) {
                return a = i(a), h(a)
            },
            human: function (a) {
                return a = i(a), a.human = !0, h(a)
            },
            get: function (a) {
                return Promise.resolve(t.messages[a])
            },
            remove: function (a) {
                return t.messages.splice(a, 1), Promise.resolve()
            },
            update: function (a, b) { // only content can be updated, not the message type.
                var c = t.messages[a];
                return c.content = b.content, c.visible = !b.loading, c.loading = !!b.loading, Promise.resolve(b.content)
            },
            removeAll: function () {
                return t.messages.splice(0, t.messages.length), Promise.resolve()
            }
        }, q.action = {
            show: l,
            hide: function () {
                return t.action.show = !1, Promise.resolve()
            },
            text: function (a) {
                return k(a), t.action.text = a.action, l(a)
            },
            button: function (a) {
                return k(a), a.type = "button", t.action.multiselect = a.multiselect || !1, t.action.button.buttons = a.action, a.multiselect && t.action.button.buttons.push({
                    text: "None of these",
                    id: ""
                }), l(a)
            },
            select: function (a) {
                if (k(a), a.type = "select", a.action.label = a.action.label || "text", a.action.value = a.action.value || "", a.action.searchselect = "undefined" == typeof a.action.searchselect ? p.searchselect : a.action.searchselect, a.action.multipleselect = a.action.multipleselect || !1, a.action.searchselect && "string" == typeof a.action.value)
                    if (!a.action.multipleselect)
                        for (var b = 0; b < a.action.options.length; b++) // Find object
                            a.action.options[b].value == a.action.value && (a.action.value = a.action.options[b]);
                    else {
                        var c = a.action.value.split(",");
                        a.action.value = [];
                        for (var b = 0; b < a.action.options.length; b++) // Find object
                            for (var d = 0; d < c.length; d++) // Search values
                                a.action.options[b].value == c[d] && a.action.value.push(a.action.options[b])
                    }
                return a.action.searchselect || a.action.options.unshift({
                    value: "",
                    text: a.action.placeholder
                }), t.action.button = a.action.button, t.action.select = a.action, l(a)
            },
            buttontext: function (a) {
                return k(a), a.type = "buttontext", t.action.button.buttons = a.actionButton, t.action.text = a.actionText, l(a)
            }
        }, p.fontawesome && f("https://use.fontawesome.com/ea731dcb6f.js"), p.searchselect && f("https://unpkg.com/vue-select@2.4.0/dist/vue-select.js", function () {
            Vue.component("v-select", VueSelect.VueSelect)
        }), p.debug && (q._botApp = m), q
    }
});
var botui = new BotUI("my-botui-app"),
    inputObj = {},
    access = !0;
(function () {
    var a = new Date,
        b = new Date(a.setHours(24, 0, 0, 0));
    a.setTime(b.getTime());
    var c = parseInt(readCookie("siteVisit"));
    document.cookie = "siteVisit=1; expires=" + a.toUTCString() + ";"
})();

function readCookie(a) {
    for (var b, d = a + "=", e = document.cookie.split(";"), f = 0; f < e.length; f++) {
        for (b = e[f];
            " " == b.charAt(0);) b = b.substring(1, b.length);
        if (0 == b.indexOf(d)) return b.substring(d.length, b.length)
    }
    return null
}

function reset() {
    botui.action.hide().then(() => botui.message.removeAll()).then(() => initBot())
}
const protocol = window.location.protocol,
    hostname = window.location.host,
    domain = protocol + "//" + hostname,
    url = domain + "/risk";

function initBot() {
    inputObj = {
        age: "",
        temperature: "",
        temperatureText: "",
        gender: "",
        genderText: "",
        symptoms: "",
        symptomsText: "",
        additionalSymptoms: "",
        additionalSymptomsText: "",
        exposureHistory: "",
        exposureHistoryText: "",
        underlyingConditions: "",
        underlyingConditionsText: "",
        progress: "",
        progressText: ""
    }, botui.message.bot({
        delay: 500,
        loading: !0,
        content: access ? "Hi! Our coronavirus disease self assessment scan has been developed on the basis of guidelines from the WHO and MHFW, Government of India. This interaction should not be taken as expert medical advice. Any information you share with us will be kept strictly confidential." : "Maximum limit reached for today"
    }).then(() => botui.message.bot({
        delay: access ? 200 : 86400000,
        content: "How old are you?"
    })).then(() => botui.action.text({
        cssClass: "my-form-control",
        action: {
            sub_type: "number",
            placeholder: "Your age in years",
            required: !0,
            min: "0",
            max: "100",
            button: {
                label: "Done"
            }
        }
    })).then(a => (inputObj.age = a.value, botui.message.bot({ // second one
        delay: 500, // wait 1 sec.
        loading: !0,
        content: "Please select your gender"
    }))).then(() => botui.action.button({ // let the user perform an action
        delay: 100,
        action: [{
            text: "Male",
            value: "1"
        }, {
            text: "Female",
            value: "2"
        }, {
            text: "Others",
            value: "0"
        }]
    })).then(a => (inputObj.gender = a.value, inputObj.genderText = a.text, botui.message.bot({
        delay: 500, // wait 1 sec.
        loading: !0,
        content: "Please let us know your current body temperature in degree Fahrenheit (Normal body temperature is 98.6\xB0F):"
    }))).then(() => botui.action.button({ // let the user perform an action
        delay: 100,
        action: [{
            text: "Normal (96\xB0F-98.6\xB0F)",
            value: "0"
        }, {
            text: "Fever\xA0(98.6\xB0F-102\xB0F)",
            value: "1"
        }, {
            text: "High Fever (>102\xB0F)",
            value: "2"
        }, {
            text: "Don\u2019t know",
            value: "0"
        }]
    })).then(a => (inputObj.temperature = a.value, inputObj.temperatureText = a.text, botui.message.bot({ // second one
        delay: 500, // wait 1 sec.
        loading: !0,
        content: "Are you experiencing any of the symptoms below (mark all those applicable)"
    }))).then(() => botui.action.button({ // let the user perform an action
        delay: 100,
        cssClass: "multiselect",
        multiselect: !0,
        action: [{
            text: "Dry Cough",
            value: "0",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Loss or diminished sense of smell",
            value: "5",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Sore Throat",
            value: "3",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Weakness",
            value: "4",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Change in Appetite  ",
            value: "6",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }]
    })).then(a => (inputObj.symptoms = a.value.join("|"), inputObj.symptomsText = a.text, "1" === inputObj.temperature && (inputObj.symptoms = inputObj.temperature + ("" === inputObj.symptoms ? "" : "|") + inputObj.symptoms, inputObj.symptomsText = inputObj.temperatureText + ("" === inputObj.symptoms ? "" : ", ") + inputObj.symptomsText), botui.message.bot({ // second one
        delay: 500, // wait 1 sec.
        loading: !0,
        content: "Additionally, please verify if you are experiencing any of the symptoms below (mark all those applicable)"
    }))).then(() => botui.action.button({ // let the user perform an action
        delay: 100,
        multiselect: !0,
        cssClass: "multiselect",
        action: [{
            text: "Moderate to Severe Cough",
            value: "0",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Feeling Breathless",
            value: "1",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Difficulty in Breathing",
            value: "3",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Drowsiness",
            value: "4",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Persistant Pain and Pressure in Chest",
            value: "5",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Severe Weakness",
            value: "6",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }]
    })).then(a => (inputObj.additionalSymptoms = a.value.join("|"), inputObj.additionalSymptomsText = a.text, "2" === inputObj.temperature && (inputObj.additionalSymptoms = inputObj.temperature + ("" === inputObj.additionalSymptoms ? "" : "|") + inputObj.additionalSymptoms, inputObj.additionalSymptomsText = inputObj.temperatureText + ("" === inputObj.additionalSymptoms ? "" : ", ") + inputObj.additionalSymptomsText), botui.message.bot({ // second one
        delay: 500, // wait 1 sec.
        loading: !0,
        content: "Please select your travel and exposure details"
    }))).then(() => botui.action.button({ // let the user perform an action
        delay: 100,
        action: [{
            text: "No Travel History",
            value: "0"
        }, {
            text: "No contact with anyone with Symptoms",
            value: "1"
        }, {
            text: "History of travel or meeting in affected geographical area in last 14 days",
            value: "2"
        }, {
            text: "Close Contact with confirmed COVID in last 14 days",
            value: "3"
        }]
    })).then(a => (inputObj.exposureHistory = a.value, inputObj.exposureHistoryText = a.text, botui.message.bot({ // second one
        delay: 500, // wait 1 sec.
        loading: !0,
        content: "Do you have a history of any of these conditions (mark all those applicable)"
    }))).then(() => botui.action.button({ // let the user perform an action
        delay: 100,
        multiselect: !0,
        cssClass: "multiselect",
        action: [{
            text: "Diabetes",
            value: "0",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "High Blood Pressure",
            value: "1",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: " Heart Disease",
            value: "2",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Kidney Disease",
            value: "3",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Lung disease",
            value: "4",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Stroke",
            value: "6",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }, {
            text: "Reduced Immunity",
            value: "7",
            actionStop: !0,
            event: function (a) {
                a.currentTarget.classList.toggle("active")
            }
        }]
    })).then((a) => {
        if (a && a.value && a.value.length > 0) {
            (inputObj.underlyingConditions = a.value.join("|"), inputObj.underlyingConditionsText = a.text, "" === inputObj.symptoms && "" === inputObj.additionalSymptoms ? void 0 : botui.message.bot({ // second one

                delay: 500, // wait 1 sec.
                loading: !0,
                content: "How have your symptoms progressed over the last 48 hrs?"
            }))
        }
    }

    ).then(() => "" === inputObj.underlyingConditions ? void 0 : botui.action.button({ // let the user perform an action
        delay: 100,
        action: [{
            text: "Improved",
            value: "0"
        }, {
            text: "No Change",
            value: "1"
        }, {
            text: "Worsened",
            value: "2"
        }, {
            text: "Worsened Considerably",
            value: "3"
        }]
    })).then(a => {
        inputObj.progress = a ? a.value : "0", inputObj.progressText = a ? a.text : "Improved", showScore()
    })
}

function add(obj) {
    let sum = 0;
    for (let data in obj) {
        sum += parseInt(obj[data]) || 0;
    }
    return sum;
}

function showScore() {
    var age;
    if (inputObj.age < 61) {
        age = 1;
    }
    else if (inputObj.age < 71) {
        age = 2;
    }
    else {
        age = 3;
    }
    let obj = {
        age: age,
        temperature: inputObj.temperature,
        gender: inputObj.gender,
        symptoms: eval(inputObj.symptoms.replace(/\|/g, "+")),
        additionalSymptoms: eval(inputObj.additionalSymptoms.replace(/\|/g, "+")),
        exposureHistory: inputObj.exposureHistory,
        underlyingConditions: eval(inputObj.underlyingConditions.replace(/\|/g, "+")),
        progress: inputObj.progress,
    }
    let sum = add(obj);
let percentage = (sum*100)/25;
if (percentage < 50)
{
    $('#myBar').css("width",percentage+"%");
    $('#myBar').css("background-color","#4CAF50");
    $('#myBar').html(percentage+"%");
}

else if (percentage < 75)
{
    $('#myBar').css("width",percentage+"%");
    $('#myBar').css("background-color","yellow");
    $('#myBar').html(percentage+"%");
}

else
{
    $('#myBar').css("width",percentage+"%");
    $('#myBar').css("background-color","red");
    $('#myBar').html(percentage+"%");
}



    // console.log("sum is ", sum);
    
    $('.modal').modal();




    let a = document.getElementsByTagName("body")[0];
    return a.classList.add("loading"), new Promise(function (b, c) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(inputObj)
        }).then(a => {
            if (!a.ok) throw response;
            return a.json()
        }).then(c => {
            setTimeout(() => {
                a.classList.remove("loading"), window.location.href = domain + "/info?id=" + c.score, b(c)
            }, 2e3)
        }).catch(function (b) {
            a.classList.remove("loading"), c(b)
        })
    })
}
initBot();