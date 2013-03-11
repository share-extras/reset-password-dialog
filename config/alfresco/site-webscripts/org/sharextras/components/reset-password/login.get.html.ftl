<@markup id="custom-guest-dependencies" target="css" action="after" scope="global">
   <@link href="${url.context}/res/extras/components/guest/custom-guest-reset-password.css" group="login"/>
</@>

<@markup id="custom-guest-dependencies" target="js" action="after" scope="global">
  <@script src="${url.context}/res/extras/components/guest/custom-guest-reset-password.js" group="login"/>
  <@script src="${url.context}/res/modules/simple-dialog.js" group="login"></@script>
</@markup>

<@markup id="custom-guest-password-link" target="buttons" action="after" scope="global">
    <@uniqueIdDiv>
        <#assign el=args.htmlid?html>
        <a id="${el}-link" href="#">${msg("link.forgotPass")}</a>
    </@uniqueIdDiv>
</@markup>
