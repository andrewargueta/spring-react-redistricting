echo 'hj';
echo $batchId;
source /etc/profile.d/modules.sh;
module load slurm;
cd /gpfs/projects/CSE416/Lions;
scancel $batchId;
rm -rf $jobId;