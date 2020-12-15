#!/usr/bin/env bash

#SBATCH --job-name=test
#SBATCH --output=test.log
#SBATCH --ntasks-per-node=28
#SBATCH --nodes=8
#SBATCH --time=2-00:00:00
#SBATCH -p long-28core

start=`date +%s`

mkdir -p jobs/$jobId/result
echo $SLURM_JOB_ID

module load slurm 
module load anaconda/3
source activate lions_env
module load intel/mpi/64/2017/0.098
module load gnu-parallel/6.0

cat << EOF > mpi.py
import os
import sys
from mpi4py import MPI

comm = MPI.COMM_WORLD
size = comm.Get_size()
rank = comm.Get_rank()

jobId = sys.argv[1]
numOfPlans = int(sys.argv[2])
pop_var = sys.argv[3]
compt = sys.argv[4]
state = sys.argv[5]

plan_cnt = numOfPlans // size

with open("jobs/$jobId/run_"+str(rank)+".txt", "w") as f:
    if rank == (size-1):
        remainder = numOfPlans % size
        for i in range(plan_cnt + remainder):
            f.write("python3 " + "algorithm.py " + jobId +" "+ str(i+rank*plan_cnt) +" "+ pop_var +" "+ compt +" "+ state+"\n")
    else:
        for i in range(plan_cnt):
            f.write("python3 " + "algorithm.py " + jobId +" "+ str(i+rank*plan_cnt) +" "+ pop_var +" "+ compt +" "+ state+"\n")
print(rank)
command = "parallel --verbose --jobs 28 < jobs/$jobId/run_"+str(rank)+".txt"
os.system(command)
EOF

mpirun -np 8 python mpi.py $jobId $numofPlans $population_var $compactness $state
python3 combine.py jobs/$jobId/result/
echo COMPLETE
echo "Duration: $((($(date +%s)-$start)/60))"