define(['bs'], function($) {

    return {

        init: function() {

            var canvas = document.createElement("canvas");
            canvas.width = 24;
            canvas.height = 24;

            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffcc99";
            ctx.font = "24px FontAwesome";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("\uf111", 12, 12);

            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#333333";
            ctx.font = "24px FontAwesome";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("\uf255", 12, 12);

            var dataURL = canvas.toDataURL('image/png');

            $('#game-action').css('cursor', 'url('+dataURL+'), auto');
        },

        getActionButtonStyle: function(index) {
            var styles = ['btn-success', 'btn-danger', 'btn-warning', 'btn-primary', 'btn-info'];
            if (typeof styles[index] !== "undefined") {
                return styles[index];
            }
            // Mod otherwise.
            return styles[index % styles.length];
        },

        renderActionButtons: function(buttons, extraClasses, extraStyles) {

            var classes = 'action-buttons';
            if (extraClasses) {
                classes = classes + ' ' + extraClasses;
            }
            var html = '<div class="' + classes + '">';
            for (var i in buttons) {

                var style = '';
                if (buttons[i].extraStyles) {
                    style = buttons[i].extraStyles;
                }

                html = html + '<button id="' + buttons[i].id + '" class="btn ' +
                    this.getActionButtonStyle(i) + '" style="' + style + '">' + buttons[i].text + '</button>';
            }

            html = html + '</div>';
            return html;
        },

        renderOkButton: function(text, buttonClass) {

            if (!text) {
                text = '<i class="fa fa-check"></i>';
            }

            if (!buttonClass) {
                buttonClass = 'btn btn-success';
            }

            return '<div class="action-buttons continue-buttons">' +
                '<button id="ok" class="' + buttonClass + '">' + text + '</button>' +
                '</div>';
        },

        showModal: function(content, okButton, buttonClass) {

            if (okButton) {
                content = content + this.renderOkButton(okButton, buttonClass);
            }

            // We overwrite possible previous contents.
            $('#text-action-content').html(content);

            $('#text-action').modal('show');

            if (okButton) {
                $('#ok').on('click', function(ev) {
                    $('#text-action').modal('hide');
                });
            }
        },

        getPunch: function() {
            return '<span class="fa-stack"><i class="fa fa-circle fa-stack-1x" style="color: #ffcc99;"></i>' +
                '<i class="fa fa-hand-rock-o fa-stack-1x" style="#333333"></i></span>'
        },

        getIntroFooter: function() {
            return '<div class="links">' +
                '<a class="left" href="https://github.com/dmonllao/badassquest" target="_blank"><i class="fa fa-2x fa-github-alt"></i></a>' +
                '<a class="center" id="share" href="#" target="_blank"><i class="fa fa-2x fa-fw fa-share-alt"></i></a>' +
                '<a class="right" href="https://soundcloud.com/friggo-cz/sophomore-makeout" target="_blank"><img src="img/soundcloud.png"/></a>' +
                '</div>';
        },

        showShare: function() {
            $('#share-text').modal('show');

            $('#share-text #return-game').on('click', function() {
                $('#share-text').modal('hide');
            });

            $('#share-twitter').on('click', function(ev) {
                ev.preventDefault();
                window.open(this.href, 'twitter', 'height=250, width=400');
            });

            $('#share-facebook').on('click', function(ev) {
                ev.preventDefault();
                window.open(this.href, 'facebook', 'height=400, width=700');
            });

            $('#share-google-plus').on('click', function(ev) {
                ev.preventDefault();
                window.open(this.href,
                  '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
            });

            $('#share-email').on('click', function(ev) {
                ev.preventDefault();
                window.open(this.href, 'email', 'height=400, width=550');
            });

        },
    }
});
