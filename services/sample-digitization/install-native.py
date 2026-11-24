"""Initial IT installation only. Registers a user service; operators subsequently use INDEX."""
import os
from pathlib import Path
import platform
import plistlib
import subprocess
import sys
import venv
root=Path(__file__).resolve().parent
if not (root/'.env').exists():raise SystemExit('IT: create .env from .env.example before installing.')
if platform.system()!='Windows':os.chmod(root/'.env',0o600)
venv.create(root/'.venv',with_pip=True)
python=root/'.venv'/('Scripts/python.exe' if platform.system()=='Windows' else 'bin/python')
subprocess.run([str(python),'-m','pip','install','-r','requirements.txt'],cwd=root,check=True)
if platform.system()=='Darwin':
 agent=Path.home()/'Library/LaunchAgents/com.sierra.sample-digitization.plist';agent.parent.mkdir(parents=True,exist_ok=True)
 log=root/'ocr-data';log.mkdir(exist_ok=True)
 agent.write_bytes(plistlib.dumps({'Label':'com.sierra.sample-digitization','ProgramArguments':[str(python),str(root/'launcher.py')],'WorkingDirectory':str(root),'RunAtLoad':True,'KeepAlive':True,'ThrottleInterval':30,'StandardOutPath':str(log/'worker.log'),'StandardErrorPath':str(log/'worker-error.log')}))
 subprocess.run(['launchctl','bootstrap',f'gui/{os.getuid()}',str(agent)],check=True)
elif platform.system()=='Windows':
 pythonw=python.with_name('pythonw.exe')
 subprocess.run(['schtasks','/Create','/TN','SIERRA Sample Digitization','/SC','ONLOGON','/TR',f'"{pythonw}" "{root / "launcher.py"}"','/F'],check=True)
 subprocess.run(['schtasks','/Run','/TN','SIERRA Sample Digitization'],check=True)
else:
 unit=Path.home()/'.config/systemd/user/sierra-sample-digitization.service';unit.parent.mkdir(parents=True,exist_ok=True)
 unit.write_text(f'[Unit]\nDescription=SIERRA Sample Digitization\nAfter=network-online.target\n[Service]\nWorkingDirectory={root}\nExecStart="{python}" "{root / "launcher.py"}"\nRestart=on-failure\nRestartSec=10\nNoNewPrivileges=true\n[Install]\nWantedBy=default.target\n')
 subprocess.run(['systemctl','--user','daemon-reload'],check=True)
 subprocess.run(['systemctl','--user','enable','--now','sierra-sample-digitization'],check=True)
print('Service installed. Check the engine heartbeat in INDEX. No terminal is needed for daily operation.')
