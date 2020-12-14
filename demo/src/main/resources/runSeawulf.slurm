#!/usr/bin/env bash

#SBATCH --job-name=test
#SBATCH --output=test.log
#SBATCH --ntasks-per-node=24
#SBATCH --nodes=2
#SBATCH --time=04:00:00
#SBATCH -p short-24core

start=`date +%s`

mkdir -p jobs/$jobId/result
touch jobs/$jobId/run.txt
echo $SLURM_JOB_ID

module load slurm 
module load anaconda/3
source activate lions_env
module load gnu-parallel/6.0

plan_cnt=1
while [ $plan_cnt -le $numofPlans ]
do
    echo python3 algorithm.py $jobId $(expr $plan_cnt - 1) $population_var $state >> jobs/$jobId/run.txt
    plan_cnt=$(expr $plan_cnt + 1)
done

echo RUNNING
parallel --verbose --jobs 24 < jobs/$jobId/run.txt
python3 combine.py jobs/$jobId/result/
echo COMPLETE
echo "Duration: $((($(date +%s)-$start)/60))"