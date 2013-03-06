/**
 * CustomLogin extension with password reset link.
 *
 * @namespace Extras
 * @class CustomLoginDialog
 */
if (typeof Extras === undefined || !Extras) {
    var Extras = {};
}

if (typeof Extras.CustomLoginDialog === "undefined" || !Extras.CustomLoginDialog) {
    Extras.CustomLoginDialog = {};
}


(function () {
    // Define constructor...
    Extras.CustomLoginDialog = function LoginWidget_constructor(htmlId) {
        Extras.CustomLoginDialog.superclass.constructor.call(this, htmlId);
        return this;
    };

    // Extend default Guest component...
    YAHOO.extend(Extras.CustomLoginDialog, Alfresco.component.Login, {

        resetPasswordDialog: null,

        onReady: function Custom_onReady() {
            // Call super class method...
            Extras.CustomLoginDialog.superclass.onReady.call(this);

            // .. hook up or lost password link event handler code
            YAHOO.util.Event.addListener("link-forgotPass", "click", function (e) {
                var actionUrl = Alfresco.constants.PROXY_URI_RELATIVE.replace("/alfresco/", "/alfresco-noauth/") + "extras/modules/reset-user-password";
                YAHOO.util.Event.stopEvent(e);
                if (!this.resetPasswordDialog) {
                    this.resetPasswordDialog = new Alfresco.module.SimpleDialog("resetPasswordDialog").setOptions({
                        width: "30em",
                        templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "extras/modules/reset-password-dialog",
                        actionUrl: actionUrl,

                        onSuccess: {
                            fn: function resetPasswordDialog_successCallback(response) {
                                Alfresco.util.PopupManager.displayMessage({
                                    text: Alfresco.util.message("message.passwordSent")
                                });
                            },
                            scope: this
                        },

                        onFailure: {
                            fn: function resetPasswordDialog_failCallback(response) {
                                var errorText = (response.json && response.json.message) ? response.json.message : Alfresco.util.message("message.unknownError"),
                                    errorTitle = (response.json && response.json.status && response.json.status.name) ? response.json.status.name : Alfresco.util.message("message.unknownErrorTitle");

                                Alfresco.util.PopupManager.displayPrompt({
                                    title: errorTitle,
                                    text: errorText
                                });
                            },
                            scope: this
                        },

                        doSetupFormsValidation: {
                            fn: function resetPasswordDialog_doSetupForm_callback(form) {},
                            scope: this
                        }
                    });
                } else {
                    this.resetPasswordDialog.setOptions({
                        actionUrl: actionUrl
                    });
                }

                this.resetPasswordDialog.show();
            },null, this);
        }

    });
})();