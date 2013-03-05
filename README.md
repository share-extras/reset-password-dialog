Reset Password Dialogue for Alfresco Share
==========================================

Author: Will Abson

This project provides a customised login page for Alfresco Share, including a 
password reset dialog that can be used to recover a lost password.

When presented with the dialog, the user can enter their e-mail address to
be sent a message containing a new password and a reminder of their username.

Installation
------------

The add-on has been developed to install on top of an existing Alfresco
3.4 installation.

An Ant build script is provided to build a JAR file containing the 
custom files, which can then be installed into the 'tomcat/shared/lib' folder 
of your Alfresco installation.

To build the JAR file, run the following command from the base project 
directory.

    ant clean dist-jar

The command should build a JAR file named reset-password-dialog.jar
in the 'build/dist' directory within your project.

To deploy the add-on files into a local Tomcat instance for testing, you can 
use the hotcopy-tomcat-jar task. You will need to set the tomcat.home
property in Ant.

    ant -Dtomcat.home=C:/Alfresco/tomcat clean hotcopy-tomcat-jar
    
Once you have run this you will need to restart Tomcat so that the classpath 
resources in the JAR file are picked up.

Using the add-on
----------------

Click the 'Forgotten Password?' link on the login page. Enter your e-mail
address and click OK to confirm.