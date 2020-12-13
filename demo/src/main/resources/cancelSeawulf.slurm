#!/usr/bin/env bash
module load slurm

scancel $batchId
cd ../
rm -rf $jobId