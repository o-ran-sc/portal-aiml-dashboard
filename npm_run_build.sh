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
REACT_APP_UCM_HOST=$REACT_APP_TM_HOST REACT_APP_UCM_PORT=$REACT_APP_TM_PORT REACT_APP_NOTEBOOK_HOST=$REACT_APP_NOTEBOOK_HOST REACT_APP_NOTEBOOK_PORT=$REACT_APP_NOTEBOOK_PORT npm run build
serve -s build -l $AIMLDASHBOARD_PORT