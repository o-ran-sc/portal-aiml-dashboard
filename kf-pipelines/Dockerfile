# ==================================================================================
#
#       Copyright (c) 2022 Samsung Electronics Co., Ltd. All Rights Reserved.
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#          http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
# ==================================================================================
FROM jupyter/scipy-notebook:notebook-6.4.3
RUN python3 -m pip install --upgrade pip
RUN pip3 install kfp==2.2.0
RUN pip3 install kfp-kubernetes
RUN pip3 install requests_toolbelt==0.10.1
ENV TA_DIR ./work
RUN mkdir -p ${TA_DIR}
WORKDIR ${TA_DIR}
COPY *.ipynb .
