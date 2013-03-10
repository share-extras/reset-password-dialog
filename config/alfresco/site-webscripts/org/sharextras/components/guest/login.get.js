/** 
	Find and replace the default Alfresco Login widget instantiation with our version.
	 
**/
for (var i=0; i<model.widgets.length; i++)
{
  if (model.widgets[i].id == "Login")
  {
    model.widgets[i].name = "Extras.CustomLoginDialog";
  }
}