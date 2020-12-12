ssh siyzou@login.seawulf.stonybrook.edu 'source /etc/profile.d/modules.sh; module load slurm; cd /gpfs/projects/CSE416/Lions; scancel' $1;
rm -rf jobs/$2;